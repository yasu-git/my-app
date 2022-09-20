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
        // Boardでpropsされた関数を渡される。
        onClick={props.onClick}
      >

        {/* boardで指定されたvalueを表示する */}
        {props.value}

      </button>
    );
  }

// 盤面を表している
class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        // gameクラスで定義しているsquares配列を使用
        value={this.props.squares[i]}
        // gameクラスでonClickでしている関数をしようする。
        onClick={() => this.props.onClick(i)} 
      />
    );
  }

  render() {
    return (
      <div>
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
      history: [
        {
        // 盤面の●×を記録する
        squares: Array(9).fill(null)
        }
    ],
      // 何番目の手かの数字
      stepNumber: 0,
      // プレイヤーがどちらかを判定する
      xIsNext: true
    };
  }

  handleClick(i) {
    
    // sliceで配列をコピーを作成している
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // 盤面の状態を保持する
    const squares = current.squares.slice();

    // 勝敗がつくかマスが埋まったときreturnする；
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
        squares: squares
        }
      ]),
      // 履歴を記録する数字
      stepNumber: history.length,
      // クリックするたびにtrueかfalse反転する
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {

    const history = this.state.history;
    // stepNumberによって選択されている着手をレンダーする
    const current = history[this.state.stepNumber];
    // 勝利者を判定し保持する
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;

    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player:' + (this.state.xIsNext ? 'X' : 'o');
    }


    return (
      <div className="game">
        <div className="game-board">
          {/* ボードクラスを表示している */}
          <Board 
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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