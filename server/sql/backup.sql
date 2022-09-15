CREATE TABLE IF NOT EXISTS public."Users" (
    id varchar PRIMARY KEY NOT NULL DEFAULT(uuid_generate_v4()),
    first_name varchar(20) NOT NULL,
    last_name varchar(20) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    phone_number varchar(11) NOT NULL,
    password varchar (500) NOT NULL,
    role roles NOT NULL DEFAULT ('employee')
);

CREATE TABLE IF NOT EXISTS public."Products" (
    code varchar(255) PRIMARY KEY NOT NULL,
    title varchar(255) NOT NULL,
    description varchar(300),
    category varchar(255) NOT NULL references "Categories" (category_name) ON UPDATE CASCADE,
    price double precision NOT NULL,
    brand_name varchar(100),
    cost_price money NOT NULL,
    quantity int NOT NULL,
    purchased int,
    product_img varchar(255),
    product_image_id varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public."Categories" (
    id SERIAL PRIMARY KEY NOT NULL,
    category_name varchar(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public."Sales" (
    id SERIAL PRIMARY KEY NOT NULL,
    customer_name varchar(200) NOT NULL,
    product_code varchar(255) NOT NULL references "Products"(code) ON UPDATE CASCADE,
    quantity int NOT NULL,
    total double precision NOT NULL GENERATED ALWAYS AS (paid - tax) STORED,
    paid double precision NOT NULL,
    balance double precision,
    sales_date date NOT NULL DEFAULT(CURRENT_DATE),
    status statuses NOT NULL,
    biller_id varchar(255) NOT NULL references "Users"(id) ON UPDATE CASCADE ON DELETE SET NULL,
    tax double precision NOT NULL
); 

CREATE TABlE IF NOT EXISTS public."Suppliers" (
    id SERIAL PRIMARY KEY NOT NULL,
    name varchar(200) NOT NULL,
    phone_number varchar(11) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    address varchar(500),
    city varchar(255) NOT NULL,
    state varchar(255) NOT NULL,
    country varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public."Purchases" (
    id SERIAL PRIMARY KEY NOT NULL,
    ref_no varchar(100) UNIQUE NOT NULL,
    supplier_id int NOT NULL references "Suppliers" (id) ON UPDATE CASCADE,
    description varchar(200) NOT NULL,
    purchase_status purchase_status NOT NULL DEFAULT('pending'),
    total double precision NOT NULL,
    paid double precision NOT NULL,
    balance double precision GENERATED ALWAYS AS (total - paid) STORED,
    payment_status statuses NOT NULL DEFAULT('pending'),
    purchase_date date NOT NULL DEFAULT(CURRENT_DATE)
);

-- CREATE TYPE roles AS ENUM('employee', 'admin')

-- CREATE TYPE statuses AS ENUM('paid', 'pending')

-- CREATE TYPE purchase_status AS ENUM('pending', 'received')
