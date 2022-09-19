import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// 正方形のマス目
  // マスを表示する部分
  function Square(props) {
    return (

      <button 
        className="square"
        // クリックしたときにマス目の状態を’Ｘ’に書き換える
        // Boardで定義された関数を渡される。
        onClick={props.onClick}
      >

        {/* boardで指定されたvalueを表示する */}
        {props.value}

      </button>
    );
  }

// 盤面を表している
class Board extends React.Component {
  // 盤面の結果を保持する
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    
    // sliceで配列をコピーを作成している
    const squares = this.state.squares.slice();

    // 勝敗がつくかマスが埋まったときreturnする；
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      // クリックするたびにtrueかfalse反転する
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square 
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)} 
      />
    );
  }

  render() {
    // 勝敗を表示するか次のプレーヤーを表示する
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        {/* 一番上の面ライン */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        {/* 真ん中のライン */}
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        {/* 下のライン */}
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}


class Game extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    }
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          {/* ボードクラスを表示している */}
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

// 勝利条件を判定する関数
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}