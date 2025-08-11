from agent.domain.match_state import Match_State


def extract_top_five_node(state: Match_State) -> Match_State:
    '''
    Extracts the top five matches from the Match_State based on their scores.
    '''
    # top_matches = sorted(
    #     state.all_data, 
    #     key=lambda x: x.score, 
    #     reverse=True
    # )[:5]

    # state.all_data = top_matches

    return state
