const mongoose = require('mongoose')

mongoose.connect(process.env.DB,{            // this function connects to the database via the URL of the database provided
    useNewUrlParser: true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify:false
})
