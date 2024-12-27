const express = require('express')
const authenticate = require('./middleware/authMiddleware')

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')
const userRoutes = require('./routes/user')
const orderRoutes = require('./routes/order')
const paymentRoutes = require('./routes/payment')



const app = express()

//JSON Parser
app.use(express.json())
app.use('/api/uploads',express.static('uploads'))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', authenticate, cartRoutes)
app.use('/api/user', authenticate, userRoutes)
app.use('/api/orders', authenticate, orderRoutes)
app.use('/api/payment', authenticate, paymentRoutes)


app.listen(8080, () => {
    console.log('Server is running')
})