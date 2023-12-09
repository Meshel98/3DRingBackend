
const express = require('express');
var cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

// Define CORS options
var corsOptions = {
    origin: [process.env.CORS_ORIGIN_1, process.env.CORS_ORIGIN_2, process.env.CORS_ORIGIN_3],
    optionsSuccessStatus: 200
}

// Apply CORS with the specified options
app.use(cors(corsOptions));

app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {

    console.log(req.body);
    const items = req.body.items;
    let lineItems = [];
    items.forEach((item)=> {
        lineItems.push(
            {
                price: item.id,
                quantity: item.quantity
            }
        )
    });

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: process.env.SUCCESS_URL,
        cancel_url: process.env.CANCEL_URL
    });


    res.send(JSON.stringify({
        url: session.url
    }));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
