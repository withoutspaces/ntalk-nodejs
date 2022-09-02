const autenticar = require('../middlewares/autenticador')

module.exports = app => {
  const { contatos } = app.controllers
  app.get('/contatos', autenticar, contatos.index)
  app.get('/contato/:id', autenticar, contatos.show) //listar contato
  app.post('/contato', autenticar, contatos.create) // criar novo contato
  app.get('/contato/:id/editar', autenticar, contatos.edit) // editar contato
  app.put('/contato/:id', autenticar, contatos.update) // update contato
  app.delete('/contato/:id', autenticar, contatos.destroy) // delete contato
}
