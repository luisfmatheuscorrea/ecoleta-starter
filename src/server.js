const express = require("express")
const server = express()

// pegar o banco de dados
const db = require("./database/db")

//configurar pasta public
server.use(express.static("public"))

// habilitar o uso do req.body
server.use(express.urlencoded({ extended: true }))

// utilizanddo template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})


// configurar caminhos na minha app
// pagina inciial
// req: Requisicao
// res: Resposta

server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um titulo" })
})

server.get("/create-point", (req, res) => {

    //re.query: Query Strings da URL
    // console.log(req.query)


    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    // req.body: o corpo do nosso form
    // console.log(req.body)

    // inserir dados no banco de dados
    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);
`


const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items
]

function afterInsertData(err) {
    if(err) {
        console.log(err)
        return res.send("Erro no Cadastro")
    }

    console.log("Cadastrado com sucesso")
    console.log(this)

    return res.render("create-point.html", { saved: true })
}

db.run(query, values, afterInsertData)

})


server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        // pesquisa vazia
        return res.render("search-results.html", { total: 0})
    }



    // pegar os dados do db

        db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
            if(err) {
                return console.log(err)
            }

            const total = rows.length

            return res.render("search-results.html", { places: rows, total: total})
        })

})

// ligar o server
server.listen(3000)