import React, { Component } from 'react';
import { graphql, gql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { func, object } from 'prop-types';
import './Scorecard.css';

class Scorecard extends Component {
  static propTypes = {
    data: object.isRequired,
    createScorecard: func.isRequired
  };

  state = {
    selectedEpisodeId: '',
    selectedCharacterId: ''
  };

  submit = () => {
    const episodeId = this.state.selectedEpisodeId;
    const characterId = this.state.selectedCharacterId;

    this.props
      .createScorecard({ variables: { episodeId, characterId } })
      .then(response => console.log(response))
      .catch(err => console.error(err));
  };

  handleSelectEpisode = e => {
    this.setState({ selectedEpisodeId: e.target.value });
  };

  render() {
    const firstEpisodeId =
      this.props.data.allEpisodes && this.props.data.allEpisodes[0].id;
    const firstCharacterId =
      this.props.data.allCharacters && this.props.data.allCharacters[0].id;

    if (this.props.data.loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="Scorecard">
        <h1>Select Episode:</h1>
        <select
          value={this.state.selectedEpisodeId || firstEpisodeId}
          onChange={e => this.setState({ selectedEpisodeId: e.target.value })}
        >
          {this.props.data.allEpisodes.map((episode, i) => {
            return (
              <option key={i} value={episode.id}>
                {episode.name}
              </option>
            );
          })}
        </select>
        <br />
        <h1>Select Character:</h1>
        <select
          value={this.state.selectedCharacterId || firstCharacterId}
          onChange={e => this.setState({ selectedCharacterId: e.target.value })}
        >
          {this.props.data.allCharacters.map((character, i) => {
            return (
              <option key={i}>
                {character.name}
              </option>
            );
          })}
        </select>
        <br />

        {this.props.data.allActionDescriptors.map((action, i) => {
          return (
            <p key={i}>
              <input type="text" placeholder={action.name} />
            </p>
          );
        })}
        <br />
        <button className="btn-link" onClick={this.submit}>
          Submit
        </button>
      </div>
    );
  }
}

// @TODO
const createAction = gql`
  mutation($scorecardId: Int!, $name: String!, $points: Int!) {
    createAction(scorecardId: $scorecardId, name: $name, points: $points) {
      id
    }
  }
`;

const createScorecard = gql`
  mutation($episodeId: Int!) {
    createScorecard(episodeId: $episodeId) {
      id
    }
  }
`;

const createUser = gql`
  mutation($email: String!, $password: String!, $name: String!) {
    createUser(
      authProvider: { email: { email: $email, password: $password } }
      name: $name
    ) {
      id
    }
  }
`;

const query = gql`
  query {
    allEpisodes {
      id
      name
    }
    allCharacters {
      id
      name
    }
    allActionDescriptors {
      name
    }
  }
`;

export default graphql(query)(
  graphql(createScorecard, { name: 'createScorecard' })(withRouter(Scorecard))
);
