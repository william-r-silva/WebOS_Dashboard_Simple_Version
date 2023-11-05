const fs = require('fs').promises;

class Dashboard {
    static async getView(req, res){
        var response = {
            view: "",
            script: ""
        }
        try {
            response.view = await fs.readFile('../dashboard/views/Home/index.html', 'utf8');
            response.script = await fs.readFile('../dashboard/views/Home/index.js', 'utf8');
        } catch (erro) {
            response = {
                view: "",
                script: ""
            }
    
            console.error('Ocorreu um erro ao ler o arquivo:', erro);
        }
        res.send(JSON.stringify(response));
    }
}
module.exports = Dashboard;