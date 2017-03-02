import preact, {Component} from 'preact';

import styles from './form.css';

const RatingButton = ({
    children,
    className,
    onClick
}) => (
    <button
        type="button"
        className={`btn btn_blue ${className}`}
        onClick={onClick}
    >
        {children}
    </button>
);

export default class Form extends Component {
    render() {
        return (
            <form onSubmit={e => e.preventDefault()}>
                <div className={styles.ratingContainer}>
                    <RatingButton
                        className={styles.ratingBtnLeft}
                        onClick={() => this.onChangeRatingClick(-1)}
                    >-</RatingButton>
                    <input
                        type="text"
                        value={this.props.minRating}
                        className={styles.input}
                        onInput={this.onInput}
                    />
                    <RatingButton
                        className={styles.ratingBtnRight}
                        onClick={() => this.onChangeRatingClick(1)}
                    >+</RatingButton>
                </div>

                <div className={styles.resetBtnContainer}>
                    <button
                        type="button"
                        className="btn btn_blue btn_mini"
                        onClick={this.onResetClick}
                    >
                        Сбросить
                    </button>
                </div>
            </form>
        );
    }

    onInput = (e) => {
        const minRating = parseInt(e.target.value.trim(), 10) || null;
        this.props.onChangeRating(minRating);
    };

    onChangeRatingClick(byValue) {
        const {minRating, onChangeRating} = this.props;
        onChangeRating(minRating + byValue);
    }

    onResetClick = () => {
        this.props.onChangeRating(null);
    }
}
