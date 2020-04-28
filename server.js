// usei o express para criar e configurar meu servidor 
const express = require("express")
const server = express()

const db = require("./db")

//Objetos de ideias
/* const ideas = [    
    {
        img:"https://image.flaticon.com/icons/svg/2729/2729007.svg",
        title:"Cursos de Programação",
        category: "Estudo",
        description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci temporibus nostrum consectetur ipsa autem aliquam, perspiciatis veritatis velit eum iusto. Dolore accusamus voluptates amet rerum odio quaerat dolorum deserunt et!",
        url:"https://rocketseat.com.br"
    },

    {
        img:"https://image.flaticon.com/icons/svg/2729/2729005.svg",
        title:"Exercícios",
        category: "Saúde",
        description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci temporibus nostrum consectetur ipsa autem aliquam, perspiciatis veritatis velit eum iusto. Dolore accusamus voluptates amet rerum odio quaerat dolorum deserunt et!",
        url:"https://rocketseat.com.br"
    },

    {
        img:"https://image.flaticon.com/icons/svg/2729/2729027.svg",
        title:"Meditação",
        category: "Mentalidade",
        description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci temporibus nostrum consectetur ipsa autem aliquam, perspiciatis veritatis velit eum iusto. Dolore accusamus voluptates amet rerum odio quaerat dolorum deserunt et!",
        url:"https://rocketseat.com.br"
    },

    {
        img:"https://image.flaticon.com/icons/svg/2729/2729032.svg",
        title:"Karaokê",
        category: "Diversão em Família",
        description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci temporibus nostrum consectetur ipsa autem aliquam, perspiciatis veritatis velit eum iusto. Dolore accusamus voluptates amet rerum odio quaerat dolorum deserunt et!",
        url:"https://rocketseat.com.br"
    },
]
 */

//configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

//habilitar uso do req.body
server.use(express.urlencoded({extended: true}))

//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views",{
    express:server,
    noCache: true, //boolean (Só enquanto está em desenvolvimento)
})

//criei uma rota/ e capturo o pedido do cliente para responder
server.get("/", function(req,res){

    //Consulta do BD
    db.all(`SELECT * FROM ideas`, function(err,rows){
        if(err){
            console.log(err)
            return res.send("Erro no banco de dados!")  
        } 

        //Regras de Negócios BE
        //Aplica ordem decrescente no objeto ideas
        const reversedIdeas = [...rows].reverse()

        const lastIdeas = []
        for(let idea of reversedIdeas){
            if(lastIdeas.length < 2){
                lastIdeas.push(idea)
            }
        }

        return res.render("index.html", {ideas: lastIdeas})
    })

    
})

server.get("/ideias", function(req,res){

    //Consulta do BD
    db.all(`SELECT * FROM ideas`, function(err,rows){
        if(err){
            console.log(err)
            return res.send("Erro no banco de dados!")  
        } 
            

        //Aplica ordem decrescente no objeto ideas
        const reversedIdeas = [...rows].reverse()

        return res.render("ideias.html", {ideas: reversedIdeas})

    })
})

//Insere no BD
server.post("/", function(req,res){
    //Inserir dados na tabela
    const query =`
        INSERT INTO ideas(
            image,
            title,
            category,
            description,
            link
    ) VALUES (?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]

    db.run(query, values, function(err){
        if(err){
            console.log(err)
            return res.send("Erro no banco de dados!")  
        } 

        return res.redirect("/ideias")
    })
})

//liguei meu servidor na porta 3000
server.listen(3000)




