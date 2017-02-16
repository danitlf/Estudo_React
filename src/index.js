import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import Home from './Home';
import Livro from './Livro';
import { Router, Route, browserHistory, IndexRoute  } from 'react-router';
import AutorBox from './Autor';

ReactDOM.render(
  (<Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/autor" component={AutorBox}/>
      <Route path="/livros" component={Livro}/>
    </Route>
  </Router>),
  document.getElementById('root')
);
