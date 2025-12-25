# Coding Best Practices Guide

This document outlines the coding standards and best practices to follow when developing in the Alagist codebase. All developers must adhere to these guidelines to maintain code quality, consistency, and prevent breaking changes.

## Table of Contents

1. [Base Rules](#base-rules)
2. [Environment Variables Management](#environment-variables-management)
3. [Status Codes Usage](#status-codes-usage)
4. [Barrel Exports](#barrel-exports)
5. [Database Schema Management](#database-schema-management)
6. [Redis Usage](#redis-usage)
7. [Type Safety](#type-safety)
8. [Utility Functions](#utility-functions)
9. [Module Structure](#module-structure)
10. [API Endpoint Development](#api-endpoint-development)
11. [Swagger Documentation](#swagger-documentation)

## Base Rules

### 🚨 Critical Restrictions

- **Source Code Only**: All development work must be done within the `src/` folder
- **Config Protection**: Changes to config files require owner approval and can cause application-wide breaking changes
- **No Direct Database Queries**: Never call database queries directly outside of repositories

### ✅ Required Practices

- Always use barrel files for exports
- Use enums in database schema when possible
- Implement proper error handling with try-catch blocks
- Follow the established module structure patterns

## Environment Variables Management

### Adding New Environment Variables

When adding a new environment variable, follow these **4 steps**:

1. **Add to `.env.example`**
2. **Update `envSchema` in `src/core/env.constants.ts`**
3. **Add static variable to `ENV` class**
4. **Configure in `configEnvironment()` function**

### Example: Adding a New API Key

```typescript
// 1. Add to .env.example
STRIPE_SECRET_KEY=sk_test_...

// 2. Update envSchema in src/core/env.constants.ts
const envSchema = z.object({
  // ... existing variables
  STRIPE_SECRET_KEY: z.string(),
});

// 3. Add static variable to ENV class
export default class ENV {
  // ... existing variables
  static STRIPE_SECRET_KEY: string;

  // 4. Configure in configEnvironment()
  public static configEnvironment() {
    // ... existing configuration
    this.STRIPE_SECRET_KEY = parsed.STRIPE_SECRET_KEY;
  }
}
```

### Usage in Code

```typescript
// ✅ Correct - Use ENV class
import { ENV } from '@/core';

const stripeKey = ENV.STRIPE_SECRET_KEY;

// ❌ Incorrect - Direct process.env access
const stripeKey = process.env.STRIPE_SECRET_KEY;
```

## Status Codes Usage

### Using HTTP Status Codes

Always use the `HTTP_STATUS` object from `src/core/status-codes.constants.ts`:

```typescript
import { HTTP_STATUS } from '@/core';

// ✅ Correct
throw new ApiError('User not found', HTTP_STATUS.NOT_FOUND);

// ❌ Incorrect
throw new ApiError('User not found', 404);
```

### Common Status Codes

```typescript
HTTP_STATUS.OK; // 200
HTTP_STATUS.CREATED; // 201
HTTP_STATUS.BAD_REQUEST; // 400
HTTP_STATUS.UNAUTHORIZED; // 401
HTTP_STATUS.NOT_FOUND; // 404
HTTP_STATUS.CONFLICT; // 409
HTTP_STATUS.INTERNAL_SERVER_ERROR; // 500
```

## Barrel Exports

### Creating Barrel Files

Every folder should have an `index.ts` file that exports all public modules:

```typescript
// src/modules/auth/controllers/index.ts
export * from './signin.controller';
export * from './signup.controller';
export * from './token.controller';
export * from './validate.controller';
export * from './otp.controller';
```

### Using Barrel Exports

```typescript
// ✅ Correct - Import from barrel file
import { signinController, signupController } from './controllers';

// ❌ Incorrect - Direct file import
import signinController from './controllers/signin.controller';
```

## Database Schema Management

### Adding New Models

1. **Update `src/database/schema/schema.ts`**
2. **Generate and apply migrations**
3. **Create entity in `src/database/entities/`**
4. **Create repository in `src/database/repositories/`**

### Example: Adding a Product Model

```typescript
// 1. Add to schema.ts
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  vendorId: uuid('vendor_id').references(() => vendors.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Generate migration
npm run migration:generate

// 3. Apply migration
npm run migration:apply
```

### Creating Entity

```typescript
// src/database/entities/product.entity.ts
import { products } from '../schema/schema';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;
```

### Creating Repository

```typescript
// src/database/repositories/product.repository.ts
import { eq } from 'drizzle-orm';
import { Database } from '../schema/schema';
import { products } from '../schema/schema';
import type { Product, NewProduct } from '../entities/product.entity';

export class ProductRepository {
  constructor(private db: Database) {}

  async create(data: NewProduct): Promise<Product> {
    const [product] = await this.db.insert(products).values(data).returning();
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    const [product] = await this.db.select().from(products).where(eq(products.id, id));
    return product || null;
  }
}
```

## Redis Usage

### Short-lived Data Storage

Use Redis for non-persistent, short-lived data like OTPs, sessions, and temporary caches:

```typescript
// src/database/redis/otp.redis.ts
import { redisClient } from '../redis';

export class OtpRedis {
  private static readonly OTP_PREFIX = 'otp:';
  private static readonly OTP_EXPIRY = 15 * 60; // 15 minutes

  static async setOtp(key: string, otp: string): Promise<void> {
    await redisClient.setex(`${this.OTP_PREFIX}${key}`, this.OTP_EXPIRY, otp);
  }

  static async getOtp(key: string): Promise<string | null> {
    return await redisClient.get(`${this.OTP_PREFIX}${key}`);
  }

  static async deleteOtp(key: string): Promise<void> {
    await redisClient.del(`${this.OTP_PREFIX}${key}`);
  }
}
```

## Type Safety

### Always Use Types

```typescript
// ✅ Correct - Proper typing
interface UserResponse {
  id: string;
  email: string;
  userType: UserType;
}

function getUser(): Promise<UserResponse> {
  // implementation
}

// ❌ Incorrect - Using 'any'
function getUser(): Promise<any> {
  // implementation
}
```

### Using Zod for Validation

```typescript
import z from 'zod';

const userSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email format'),
  password: z.string().min(8),
  userType: z.enum(['CUSTOMER', 'VENDOR']),
});

type UserRequest = z.infer<typeof userSchema>;
```

## Utility Functions

### Shared Functions

Place reusable functions in `src/utils/`:

```typescript
// src/utils/date.util.ts
export function formatDate(date: Date): string {
  return date.toISOString();
}

export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

// src/utils/index.ts
export * from './date.util';
export * from './hash.util';
export * from './jwt.util';
```

## Module Structure

### Creating a New Module

Follow this exact structure for new modules:

```
src/modules/your-module/
├── index.ts              # Main router
├── controllers/
│   ├── index.ts          # Barrel export
│   └── your.controller.ts
├── services/
│   ├── index.ts          # Barrel export
│   └── your.service.ts
├── dto/
│   ├── index.ts          # Barrel export
│   └── your.dto.ts
└── swagger/
    └── your.swagger.yaml
```

### Example: Creating a Product Module

```typescript
// src/modules/product/index.ts
import { Router } from 'express';
import { productController } from './controllers';

const router = Router();

router.use('/products', productController);

export default router;

// Add to main modules index.ts
import productRouter from './product';
router.use('/api/v1', productRouter);
```

## API Endpoint Development

### Step-by-Step Process

#### 1. Create DTO (Data Transfer Object)

```typescript
// src/modules/product/dto/product.dto.ts
import z from 'zod';
import type { ProductStatus } from '@/database/entities';

export interface ProductResponseDto {
  id: string;
  name: string;
  price: number;
  status: ProductStatus;
  vendorId: string;
}

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().positive('Price must be positive'),
  description: z.string().optional(),
});

export type CreateProductRequestDto = z.infer<typeof createProductSchema>;
```

#### 2. Create Service

```typescript
// src/modules/product/services/product.service.ts
import { HTTP_STATUS } from '@/core';
import { ProductRepository } from '@/database/repositories';
import { ApiError, type DataResponse } from '@/types';
import type { CreateProductRequestDto, ProductResponseDto } from '../dto/product.dto';

const productRepository = new ProductRepository();

export async function createProductService(
  data: CreateProductRequestDto,
  vendorId: string,
): Promise<DataResponse<ProductResponseDto>> {
  const { name, price, description } = data;

  // Business logic validation
  if (price < 0) {
    throw new ApiError('Price cannot be negative', HTTP_STATUS.BAD_REQUEST);
  }

  // Create product
  const product = await productRepository.create({
    name,
    price,
    description,
    vendorId,
    status: 'ACTIVE',
  });

  return {
    message: 'Product created successfully',
    status: HTTP_STATUS.CREATED,
    data: {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      status: product.status,
      vendorId: product.vendorId,
    },
  };
}
```

#### 3. Create Controller

```typescript
// src/modules/product/controllers/product.controller.ts
import { Router } from 'express';
import type { AuthRequest } from '@/types';
import { createProductSchema } from '../dto/product.dto';
import { createProductService } from '../services/product.service';

const router = Router();

router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = await createProductSchema.parseAsync(req.body);
    const response = await createProductService(data, req.user.id);
    res.sendResponse(response);
  } catch (error: any) {
    res.sendResponse(error);
  }
});

export default router;
```

#### 4. Add to Barrel Exports

```typescript
// src/modules/product/controllers/index.ts
export { default as productController } from './product.controller';

// src/modules/product/services/index.ts
export { createProductService } from './product.service';

// src/modules/product/dto/index.ts
export * from './product.dto';
```

## Swagger Documentation

### Creating Swagger Files

Create separate YAML files for each endpoint group:

```yaml
# src/modules/product/swagger/product.swagger.yaml
paths:
  /api/v1/products:
    post:
      tags:
        - Products
      summary: Create a new product
      description: |
        Create a new product for the authenticated vendor.

        **Requirements**:
        - Vendor authentication required
        - Product name must be unique per vendor
        - Price must be positive
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateProductRequest'
            examples:
              basic_product:
                summary: Basic Product
                value:
                  name: 'Premium Widget'
                  price: 29.99
                  description: 'High-quality widget for all needs'
      responses:
        '201':
          description: Product created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductResponse'
              examples:
                success_response:
                  summary: Success Response
                  value:
                    status: 201
                    message: 'Product created successfully'
                    data:
                      id: '123e4567-e89b-12d3-a456-426614174000'
                      name: 'Premium Widget'
                      price: 29.99
                      status: 'ACTIVE'
                      vendorId: '456e7890-f12c-34d5-e678-537725285111'
        '400':
          description: Bad request - Invalid data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationError'
              examples:
                invalid_price:
                  summary: Invalid Price
                  value:
                    status: 400
                    message: 'Price must be positive'
        '401':
          description: Unauthorized - Authentication required
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UnauthorizedError'

components:
  schemas:
    CreateProductRequest:
      type: object
      required:
        - name
        - price
      properties:
        name:
          type: string
          minLength: 1
          description: Product name
        price:
          type: number
          minimum: 0
          description: Product price
        description:
          type: string
          description: Product description
    ProductResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        price:
          type: number
        status:
          type: string
          enum: [ACTIVE, INACTIVE, DELETED]
        vendorId:
          type: string
          format: uuid
```

### Swagger Best Practices

1. **Use Components**: Define reusable schemas in components section
2. **Provide Examples**: Include multiple examples for different scenarios
3. **Error Responses**: Document all possible error responses
4. **Security**: Specify authentication requirements
5. **Descriptions**: Write clear, detailed descriptions

## Response Handling

### Service Response Types

Services can return these types:

```typescript
// DataResponse - For JSON responses
{
  message: string;
  status: number;
  data: T;
  headers?: Array<{ name: string; value: string }>;
  pagination?: Array<{
    page: number;
    size: number;
    total: number;
    pages: number;
  }>;
}

// DownloadResponse - For file downloads
{
  filePath: string;
  fileName: string;
  headers?: Array<{ name: string; value: string }>;
}

// ViewResponse - For file viewing
{
  filePath: string;
  headers?: Array<{ name: string; value: string }>;
}
```

### Error Handling

```typescript
// In Service
if (!user) {
  throw new ApiError('User not found', HTTP_STATUS.NOT_FOUND);
}

// In Controller
try {
  const response = await someService(data);
  res.sendResponse(response);
} catch (error: any) {
  res.sendResponse(error);
}
```

## Migration and Seeding

### Database Migrations

Refer to the [Database Migration Guide](./MIGRATION_GUIDE.md) document

### Creating Seed Data

```typescript
// src/database/seed/products.seed.ts
import { products } from '../schema/schema';
import { Database } from '../schema/schema';

export async function seedProducts(db: Database) {
  await db.insert(products).values([
    {
      name: 'Sample Product 1',
      price: 19.99,
      vendorId: 'vendor-id-1',
    },
    {
      name: 'Sample Product 2',
      price: 29.99,
      vendorId: 'vendor-id-2',
    },
  ]);
}
```

## Summary

Following these best practices ensures:

- **Consistency**: All code follows the same patterns
- **Maintainability**: Easy to understand and modify
- **Type Safety**: Prevents runtime errors
- **Documentation**: Clear API documentation
- **Scalability**: Structured for growth

Remember to always reference the auth module (`src/modules/auth/`) as the canonical example of these patterns in practice.

## Related Documentation

For additional information and guides, refer to these related documents:

- **[Requirements](./REQUIREMENTS.md)** - System requirements and dependencies
- **[Database Schema](./DATABASE_SCHEMA.md)** - Complete database structure and relationships
- **[Migration Guide](./MIGRATION_GUIDE.md)** - Database migration procedures and best practices
- **[Docker Setup](./DOCKER_README.md)** - Docker configuration and deployment
- **[Startup Guide](./STARTUP.md)** - Local development setup instructions
- **[Docker Startup](./STARTUP_DOCKER.md)** - Docker-based development environment setup
