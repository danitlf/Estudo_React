import React, { Component } from 'react';
import InputCustomizado from './Components/InputCustomizado';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {

    constructor(props) {
        super();
        this.state = { titulo: '', preco: '', autorId: '' };
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
    }


    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: 'http://localhost:8080/api/livros',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId }),
            success: function (novaListagem) {
                PubSub.publish('atualiza-lista-livros', novaListagem);
                this.setState({ titulo: '', preco: '', autorId: '' });
            }.bind(this),
            error: function (resposta) {
                if (resposta.status === 400) {
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend: function () {
                PubSub.publish("limpa-erros", {});
            }
        });
    }

    setTitulo(evento) {
        this.setState({ titulo: evento.target.value });
    }

    setPreco(evento) {
        this.setState({ preco: evento.target.value });
    }
    setAutorId(evento) {
        this.setState({ autorId: evento.target.value });
    }

    render() {
        return (
            <div className="pure-form pure-form-aligner">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="titulo" type="text" nome="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Titulo" />
                    <InputCustomizado id="preco" type="text" nome="preco" value={this.state.preco} onChange={this.setPreco} label="Preço" />
                    <div className="pure-control-group">
                        <label htmlFor="autorId" >Autores</label>
                        <select id="autorId" value={this.state.autorId} name="autorId" onChange={this.setAutorId}>
                            <option value="">Selecione Autor</option>
                            {
                                this.props.autores.map(function (autor) {
                                    return <option key={autor.id} value={autor.id}>{autor.nome}</option>;
                                })
                            }
                        </select>
                    </div>
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>
                </form>
            </div>
        );

    }

}

class ListaLivros extends Component {
    constructor() {
        super();

    }

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Preço</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map(function (livro) {
                                return (
                                    <tr key={livro.id}>
                                        <td>{livro.titulo}</td>
                                        <td>{livro.preco}</td>
                                        <td>{livro.autor.nome}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );

    }

}


export default class Livro extends Component {
    constructor() {
        super();
        this.state = { lista: [], autores: [] };
        PubSub.subscribe('atualiza-lista-livros', function (topico, novaLista) {
            this.setState({ lista: novaLista });
        }.bind(this));
    }

    componentDidMount() {
        $.ajax({
            url: "http://localhost:8080/api/livros",
            dataType: 'json',
            success: function (resposta) {
                console.log(resposta);
                this.setState({ lista: resposta });
            }.bind(this)
        }
        );
        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: 'json',
            success: function (resposta) {
                this.setState({ autores: resposta });
            }.bind(this)
        }
        );
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores} />
                    <ListaLivros lista={this.state.lista} />
                </div>
            </div>
        );
    }
}