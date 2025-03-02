
## Installation and Setup Guide

## Prerequisites

Before starting, ensure you have the following dependencies installed on your system:

1. **[Laragon](https://laragon.org/)** (for an easy local development environment setup)
2. **PHP** (version 8.2 or later)
3. **[Node.js](https://nodejs.org/)** (version 16 or later) and **npm**
4. **[Composer](https://getcomposer.org/)** (for managing PHP dependencies)
5. **[Shopify CLI](https://shopify.dev/docs/cli/)** (for Shopify app development)
6. **[Ngrok](https://ngrok.com/)** (for exposing local server to public)
7. **[Git](https://git-scm.com/)** (for version control)

---


### Step 1: Clone the repository

First, clone the repository from GitHub.

```bash
git clone https://github.com/smshahriar10/ShipDeals.git
cd ShipDeals
```

### Step 2: Create the database

Create a new MySQL database named `ShipDeals`:

```sql
CREATE DATABASE ShipDeals;
```

### Step 3: Install dependencies

#### Install PHP dependencies

Install the required PHP dependencies using Composer:

```bash
composer install
```

#### Install JavaScript dependencies

Next, install the JavaScript dependencies using npm:

```bash
npm install
```

### Step 4: Configure environment variables

Create a `.env` file at the root of the project directory. Add the following configuration:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ShipDeals
DB_USERNAME=root
DB_PASSWORD=
```

This configures the database connection for the app.

### Step 5: Run migrations

Run the migrations to set up the database schema:

```bash
php artisan migrate
```

### Step 6: Serve the application

Start the application locally using the built-in Laravel server:

```bash
php artisan serve
```

### Step 7a: Build the front-end

Run the following command to build the front-end assets:

```bash
npm run devv
```

### Step 7b: Shopify function run

Run the following command to run the Shopify functions:

```bash
npm run dev
```

### Step 8: Expose local server with Ngrok

You can expose your local server to the public using Ngrok. Run the following command to generate a public URL for your local server:

```bash
ngrok http 8000
```

Note down the Ngrok URL provided (e.g., `http://xxxxxx.ngrok.io`).

### Step 9: Shopify Configuration

#### Create shopify manual app and shopify store

You need to configure your Shopify app in the `.env` file for it to connect to your store:

```env
SHOPIFY_APP_NAME='shipping_discount'
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
SHOPIFY_FRONTEND_ENGINE=REACT
SHIPPING_DISCOUNT_FUNCTION_ID=your-shipping-discount-function-id
ADVANCE_SHIPPING_DISCOUNT_FUNCTION_ID=your-advance-shipping-discount-function-id
```

Replace the placeholders (`your-shopify-api-key`, `your-shop-name.myshopify.com`, etc.) with your actual Shopify app details.

### Step 10: Configure the `shopify.app.toml` file

In the `config` directory, you’ll find the `shopify.app.toml` file. Configure the file as follows:

```toml
client_id=your-client-id
name="shipping_discount"
handle="app-handle"
application_url='ngrok-url' # Replace with your actual Ngrok URL
```

Replace `your-client-id`, `app-handle`, and `ngrok-url` with the appropriate values.

### Step 11: Development Mode Setup

After configuring the `.env` file and the `shopify.app.toml` file, you can run the following command to start the development server for Shopify:

```bash
shopify app dev
```

This will initiate the development environment and allow you to test the app on your store.

---

## Running the Application

#### Configure shopify app url and  redirect url  

1. Log in to your **[Shopify Partners Dashboard](https://partners.shopify.com/)**.
2. Navigate to your app and open the **App setup** section.
3. Set the following URLs:
   - **App URL**: The Ngrok URL you generated earlier (`http://xxxxxx.ngrok.io`).
   - **Redirect URL(s)**: Add your app's callback URLs as needed.

---

---

## Debug and Testing

#### To see the instructions count and benchmark in local.

1. Navigate to your extensions folder from root directory in cmd using this command: cd extensions/path-to-your-extension
2. Create new file input.json
3. Then from shopify store's extensions run details paste the Input (STDIN).
4. Save the file
5. Now in cmd use this command: cat src/input.json | npm run shopify app function run -- --export=run
6. Now you will see the Instructions count and Benchmark

---
