import React, { Component } from 'react';
import { graphql, gql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { func, object } from 'prop-types';
import queryString from 'query-string';
import './CreateScorecard.css';

class CreateScorecard extends Component {
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
      .then(response => {
        return this.createActions(response.data.createScorecard.id);
      })
      .then(response => {
        console.log('fin');
      })
      .catch(err => console.error(err));
  };

  createActions(scorecardId) {
    const { allActionDescriptors } = this.props.data;

    // Get all action input values
    const actions = allActionDescriptors.map(action => {
      return {
        name: action.name,
        note: '', // @TODO Do we need this?
        points: parseInt(this[`action_${action.id}`].value) || 0,
        scorecardId
      };
    });

    // Create array of promises to create each action
    const createActions = actions.map(action => {
      return this.props.createAction({ variables: action });
    });

    return Promise.all(createActions);
  }

  componentWillReceiveProps(nextProps) {
    const firstEpisodeId =
      nextProps.data.allEpisodes && nextProps.data.allEpisodes[0].id;
    const firstCharacterId =
      nextProps.data.allCharacters && nextProps.data.allCharacters[0].id;

    this.setState({
      selectedEpisodeId: firstEpisodeId,
      selectedCharacterId: firstCharacterId
    });
  }

  handleSelectEpisode = e => {
    // this.setState({ selectedEpisodeId: e.target.value });
    this.props.history.push(`/scorecard/new?episodeId=${e.target.value}`);
  };

  handleSelectCharacter = e => {
    // this.setState({ selectedEpisodeId: e.target.value });
    this.props.history.push(`/scorecard/new?episodeId=${e.target.value}`);
  };

  render() {
    const { data } = this.props;
    const scorecard = data.allScorecards && data.allScorecards[0];

    if (this.props.data.loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="CreateScorecard">
        <h1>Select Episode:</h1>
        <select
          value={this.state.selectedEpisodeId}
          onChange={this.handleSelectEpisode}
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
          value={this.state.selectedCharacterId}
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

        {scorecard &&
          scorecard.actions.map((action, i) => {
            return (
              <p key={i}>
                <input
                  type="text"
                  placeholder={action.name}
                  defaultValue={action.points}
                  ref={input => (this[`action_${action.id}`] = input)}
                />
              </p>
            );
          })}

        {!scorecard &&
          this.props.data.allActionDescriptors.map((action, i) => {
            return (
              <p key={i}>
                <input
                  type="text"
                  placeholder={action.name}
                  ref={input => (this[`action_${action.id}`] = input)}
                />
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

const createAction = gql`
  mutation($scorecardId: ID!, $name: String!, $points: Int!, $note: String!) {
    createAction(
      scorecardId: $scorecardId
      name: $name
      points: $points
      note: $note
    ) {
      id
    }
  }
`;

const createScorecard = gql`
  mutation($episodeId: ID!, $characterId: ID!) {
    createScorecard(episodeId: $episodeId, characterId: $characterId) {
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
  query($episodeId: ID!, $characterId: ID!) {
    allEpisodes {
      id
      name
    }
    allCharacters {
      id
      name
    }
    allActionDescriptors {
      id
      name
    }
    allScorecards(
      filter: { episode: { id: $episodeId }, character: { id: $characterId } }
    ) {
      id
      episode {
        id
      }
      character {
        id
      }
      actions {
        id
        name
        points
      }
    }
  }
`;

export default compose(
  graphql(query, {
    options: props => {
      const params = queryString.parse(props.history.location.search);

      return {
        variables: {
          episodeId: params.episodeId || '',
          characterId: params.characterId || ''
        }
      };
    }
  }),
  graphql(createScorecard, { name: 'createScorecard' }),
  graphql(createAction, { name: 'createAction' })
)(withRouter(CreateScorecard));
