import {
    pgTable,
    serial,
    varchar,
    text,
    integer,
    real,
    boolean,
    timestamp,
    pgEnum,
} from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'employee', 'manager']);
export const productTypeEnum = pgEnum('product_type', ['clothes', 'equipment']);
export const clothesTypeEnum = pgEnum('clothes_type', ['hat', 'top', 'bottom', 'shoes', 'sock']);
export const sizeEnum = pgEnum('size', ['XS', 'S', 'M', 'L', 'XL', '2XL']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'delivery', 'successed', 'cancelled']);

// Users table
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).unique().notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    role: userRoleEnum('role').notNull(),
    isActive: boolean('is_active').default(true),
});

// Addresses table
export const addresses = pgTable('addresses', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    addressDetail: text('address_detail').notNull(),
    isDefault: boolean('is_default').default(false),
});

// Products table
export const products = pgTable('products', {
    productId: serial('product_id').primaryKey(),
    productName: varchar('product_name', { length: 255 }).notNull(),
    productType: productTypeEnum('product_type').notNull(),
    price: real('price').notNull(),
    amount: integer('amount').notNull(),
});

// Equipment details table (1:1 relation with products)
export const equipmentDetails = pgTable('equipment_details', {
    productId: integer('product_id').primaryKey().references(() => products.productId),
    sportTypeId: integer('sport_type_id'),
    brand: varchar('brand', { length: 100 }),
    weightG: real('weight_g'),
});

// Clothes details table (1:1 relation with products)
export const clothesDetails = pgTable('clothes_details', {
    productId: integer('product_id').primaryKey().references(() => products.productId),
    clothesType: clothesTypeEnum('clothes_type').notNull(),
    size: sizeEnum('size').notNull(),
    color: varchar('color', { length: 100 }).notNull(),
    fabricMaterial: varchar('fabric_material', { length: 100 }),
});

// Orders table
export const orders = pgTable('orders', {
    orderId: serial('order_id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    addressId: integer('address_id').references(() => addresses.id),
    totalAmount: real('total_amount').notNull(),
    status: orderStatusEnum('status').default('pending').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

// Order details table
export const orderDetails = pgTable('order_details', {
    id: serial('id').primaryKey(),
    orderId: integer('order_id').references(() => orders.orderId),
    productId: integer('product_id').references(() => products.productId),
    amount: integer('amount').notNull(),
    totalPrice: real('total_price').notNull(),
});

// Export default for easy importing
export default { users, addresses, products, equipmentDetails, clothesDetails, orders, orderDetails };