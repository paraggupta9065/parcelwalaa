const Products = require("../model/product")

exports.addProduct = async (req, res) => {
    try {
        const productData = req.body

        const product = await Products.create(productData);

        res.status(201).send(product);
    } catch (error) {
        console.log(error);
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);

        if (!product) {
            return res.status(404).send({ msg: "Product not found" })
        }

        await Products.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })

        const updatedProduct = await Products.findById(req.params.id);

        res.status(200).send({
            msg: "Updated sucessfully",
            product: updatedProduct,
        })
    } catch (error) {
        console.log(error);
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Products.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).send({ msg: "Product not found." });
        }

        res.status(200).send({ msg: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = await Products.find();

        res.status(200).send(products);
    } catch (error) {
        console.log(error);
    }
}
