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
                <div className={styles.line}>Средний рейтинг: <strong>{averageRating}</strong></div>
                <div className={styles.line}>Показано комм: <strong>{shownCommentsCount}</strong> из <strong>{totalCommentsCount}</strong></div>

                <Form
                    minRating={minRating}
                    onChangeRating={this.onChangeRating}
                />
            </div>
        );
    }

    onChangeRating = (minRating) => {
        const shownCommentsCount = filter(minRating);

        this.setState({
            shownCommentsCount,
            minRating
        });
    }
}
