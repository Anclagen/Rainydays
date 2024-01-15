# **Raindays Headless API**

# Useful routes and queries

**Key queries to get results** `?consumer_key={key}&consumer_secret={key}`

**All products** `/wp-json/wc/v3/products`

**Product by id** `/wp-json/wc/v3/products/{id}`

**Get all product variations of id** `/wp-json/wc/v3/products/{id}/variations`

**Multiple product by id** `/wp-json/wc/v3/products?include={id},{id},{id}`

**Increase number of result** `/wp-json/wc/v3/products?per_page={number}`

**Search** `/wp-json/wc/v3/products?search={search query}`

Might be better to divide queries into individual words for better search results and use `search={word1},{word2},{word3}...`

Search results are based on descriptions and name, as such I used the short description to add relevant information on the product. In retrospect I should of put the custom attribute for specification in the main description and used the short description for the page details on the product.

# Product Setup

## **Price**

Variable products from WooCommerce when on sale don't provide the regular price, so the regular prices needs to be extracted from the price html key.

### **keys for an individual product**

**price:** gives current price `data.price`

**on_sale:** boolean for if item is on sale. `data.on_sale`

**regular_price:** blank on the base variable product page, but present when calling variant IDs. `data.regular_price`

**price_html:** will contain the regular price and sale price on base product, so regular price can be extracted with `match(/[\d\.]+/)` as it is the first price in the html. `data.price_html`

## **Product Attributes**

I used attributes to add product details as the received data was more easily managed vs categories in the returned json. As well as making it easier to integrate into my pre-existing filter.

### Colours - Array of colours the product is a available in.

Used for variable product variations. `data.attributes[0].options`

### Sizes - Array of sizes the product is a available in.

Used for variable product variations. `data.attributes[1].options`

### Brand - Array with 1 item that is the brand name.

`data.attributes[2].options`

### Sex - Array with the sex the item is intended for.

`data.attributes[3].options`

### Specification - Array with specification details for item.

`data.attributes[4].options`

### Category - Array with relevant categories for item.

`data.attributes[5].options`
