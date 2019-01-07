import React from 'react';
import { connect } from 'react-redux'
import { loadItems } from '../Entities/Event.js';
import './EventsList.css'
class EventsList extends Component {

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(loadItems());
    }
    render() {

        const {items, loading } = this.props;

        if (loading) {
            return 'Loading...'
        }
        return(
            <div>
                {items.map(item =>(
                    <div className="Events-ListItem" key={item.id}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <h3>{item.title}</h3>
                    </a>
                    </div>
                ))}
            </div>
        );
    }
}

export default EventsList;