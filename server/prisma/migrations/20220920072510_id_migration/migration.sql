-- CreateEnum
CREATE TYPE "roles" AS ENUM ('employee', 'admin');

-- CreateEnum
CREATE TYPE "statuses" AS ENUM ('paid', 'pending');

-- CreateEnum
CREATE TYPE "purchase_status" AS ENUM ('pending', 'received');

-- CreateTable
CREATE TABLE "Users" (
    "id" VARCHAR NOT NULL,
    "first_name" VARCHAR(20) NOT NULL,
    "last_name" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(11) NOT NULL,
    "password" VARCHAR(500) NOT NULL,
    "role" "roles" NOT NULL DEFAULT 'employee',
    "profileImage" VARCHAR(255),
    "profileImageId" VARCHAR(255),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "category_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "code" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(300),
    "category" VARCHAR(255) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "brand_name" VARCHAR(100),
    "cost_price" MONEY NOT NULL,
    "quantity" INTEGER NOT NULL,
    "purchased" INTEGER,
    "product_img" VARCHAR(255),
    "product_image_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Purchases" (
    "id" SERIAL NOT NULL,
    "ref_no" VARCHAR(100) NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "purchase_status" "purchase_status" NOT NULL DEFAULT 'pending',
    "total" DOUBLE PRECISION NOT NULL,
    "paid" DOUBLE PRECISION NOT NULL,
    "balance" DOUBLE PRECISION GENERATED ALWAYS AS (total - paid) STORED,
    "payment_status" "statuses" NOT NULL DEFAULT 'pending',
    "purchase_date" DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "Purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sales" (
    "id" SERIAL NOT NULL,
    "product_code" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL GENERATED ALWAYS AS (paid - tax) STORED,
    "paid" DOUBLE PRECISION NOT NULL,
    "balance" DOUBLE PRECISION,
    "sales_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "status" "statuses" NOT NULL,
    "biller_id" VARCHAR(255) NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "customer_name" VARCHAR(200) NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suppliers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "phone_number" VARCHAR(11) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "address" VARCHAR(500),
    "city" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_category_name_key" ON "Categories"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "Purchases_ref_no_key" ON "Purchases"("ref_no");

-- CreateIndex
CREATE UNIQUE INDEX "Suppliers_email_key" ON "Suppliers"("email");

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_category_fkey" FOREIGN KEY ("category") REFERENCES "Categories"("category_name") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Suppliers"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_product_code_fkey" FOREIGN KEY ("product_code") REFERENCES "Products"("code") ON DELETE NO ACTION ON UPDATE CASCADE;
