import React, { Component } from 'react';
import './App.css';
import players from './players';
import characters from './characters';
import { withRouter } from 'react-router-dom';

const getTeamForPlayer = id => {
  return characters.filter(char => char.player_id === id);
};

class App extends Component {
  render() {
    return (
      <div className="app">
        <h1>## Leaderboard</h1>
        <table className="leaderboard-table">
          <tbody>
            <tr>
              <td>Rank</td>
              <td>Name</td>
              <td>Team</td>
              <td>Points</td>
            </tr>
            {players.map((player, i) => {
              return (
                <tr key={i}>
                  <td>
                    <b>
                      {i}
                    </b>
                  </td>
                  <td>
                    {player.name}
                  </td>
                  <td
                    dangerouslySetInnerHTML={{
                      __html: getTeamForPlayer(player.id)
                        .map(char => char.name)
                        .join(',<br/>')
                    }}
                  />
                  <td className="points">0</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h1>## Characters</h1>
        <table className="table">
          <tbody>
            <tr>
              <td>Name</td>
              <td>Image</td>
            </tr>
            {characters.map((char, i) => {
              return (
                <tr key={i}>
                  <td>
                    {char.name}
                  </td>
                  <td>
                    <img src={char.img} width="50" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(App);
