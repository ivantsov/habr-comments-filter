import preact, {Component} from 'preact';

import styles from './form.css';

const RatingButton = ({
    children,
    className,
    onClick
}) => (
    <button
        type="button"
        className={className}
        onClick={onClick}
    >
        {children}
    </button>
);

export default class Form extends Component {
    render() {
        return (
            <form>
                <div className={styles.ratingContainer}>
                    <RatingButton
                        className={`btn ${styles.ratingBtnLeft}`}
                        onClick={() => this.onChangeRatingClick(-1)}
                    >-</RatingButton>
                    <input
                        type="text"
                        value={this.props.minRating}
                        className={styles.input}
                        onChange={this.onInputChange}
                    />
                    <RatingButton
                        className={`btn ${styles.ratingBtnRight}`}
                        onClick={() => this.onChangeRatingClick(1)}
                    >+</RatingButton>
                </div>

                <div className={styles.resetBtnContainer}>
                    <button
                        className="btn btn_blue btn_large"
                        onClick={() => {
                        }}
                    >
                        Reset
                    </button>
                </div>
            </form>
        );
    }

    onInputChange = (e) => {
        const minRating = e.target.value.trim();

        this.setState({minRating});
    };

    onChangeRatingClick(byValue) {
        const {minRating, onChangeRatingClick} = this.props;
        const nextMinRating = Math.max(minRating + byValue, 0);

        onChangeRatingClick(nextMinRating);
    }
}
