const { response } = require("express")
const express = require("express")
const uuid = require("uuid")

const app = express()
const porta = 3000
app.use(express.json())

const pedidoDosClient = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = pedidoDosClient.findIndex(order => order.id === id)

    if (index < 0) {
        return response.json({error: "Order not found"})
    }

    request.orderId = id
    request.orderIndex = index

    next()
}

const mostrarMetodoUrl = (request, response,next) => {
    const url = request.url
    const method = request.method
    console.log(`[${method}] - ${url}`)
    next()
}

app.post("/order",mostrarMetodoUrl, (request, response) => {
    const { order, clientName, price} = request.body
    const newPedido = {id: uuid.v4(), order, clientName, price, status: "Em preparação"}
    pedidoDosClient.push(newPedido)
    return response.status(201).json(newPedido)
})

app.get("/order",mostrarMetodoUrl, (request, response) => {
    return response.json(pedidoDosClient)
})

app.get("/order/:id", checkOrderId, mostrarMetodoUrl,(request, response) => {
    const index = request.orderIndex
    return response.json(pedidoDosClient[index])
})

app.put("/order/:id", checkOrderId, mostrarMetodoUrl, (request, response) => {
    const id = request.orderId
    const index = request.orderIndex
    const { order, clientName, price} = request.body
    const updatedOrder = {id, order, clientName, price, status:"Em preparação"}
    pedidoDosClient[index] = updatedOrder
    return response.json(updatedOrder)
})

app.delete("/order/:id", checkOrderId, mostrarMetodoUrl, (request, response) => {
    const index = request.orderIndex
    pedidoDosClient.splice(index, 1)
    return response.status(204).json({message: "Order delete"})
})

app.patch("/order/:id", checkOrderId, mostrarMetodoUrl, (request, response) => {
    const index = request.orderIndex
    pedidoDosClient[index].status = "Pronto"
    return response.json(pedidoDosClient[index])
})

app.listen(3000, () => {
    console.log(`Iniciando servidor na porta: ${porta}` )
})