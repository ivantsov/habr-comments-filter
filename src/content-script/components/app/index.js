import preact, {Component} from 'preact';
import {parse, filter} from '../../modules/filter';
import Form from '../form';

import styles from './app.css';

export default class App extends Component {
    componentWillMount() {
        const commentsData = parse();
        this.setState(commentsData);
    }

    render() {
        const {
            totalCommentsCount,
            shownCommentsCount,
            averageRating,
            minRating
        } = this.state;

        return (
            <div className={styles.container}>
                <div>Average raiting: {averageRating}</div>
                <div>{shownCommentsCount} of {totalCommentsCount} comments shown</div>

                <Form
                    minRating={minRating}
                    onChangeRatingClick={this.onChangeRatingClick}
                />
            </div>
        );
    }

    onChangeRatingClick = (minRating) => {
        const shownCommentsCount = filter(minRating);

        this.setState({
            shownCommentsCount,
            minRating
        });
    }
}
