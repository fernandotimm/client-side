import _                  from 'lodash';
import styles             from './styles.module.scss';
import { connect }        from 'react-redux';
import { getDefaultUser } from '../../helper/Profile';
import TimeLeftCounter from 'components/TimeLeftCounter';
import classNames from 'classnames';
import Icon from 'components/Icon';
import IconType from 'components/Icon/IconType';
import PopupTheme from 'components/Popup/PopupTheme';
import { PopupActions } from 'store/actions/popup';
import { useState } from 'react';
import StateBadge from 'components/StateBadge';
import Button from 'components/Button';
import HighlightType from 'components/Highlight/HighlightType';

const RelatedBetCard = ({ onClick, title, user, image, showEventEnd, betId, endDate, showPopup, eventId, status, eventName, startPrice, prediction, cashout }) => {

    const [menuOpened, setMenuOpened] = useState(false);

    const renderMenuContainer = () => {
        return (
            <div
                className={classNames(
                    styles.menuContainer,
                    // isPopup ? styles.popupMenuContainer : null,
                )}
            >
                {renderMenu()}
            </div>
        );
    };

    const renderMenu = () => {
        const renderMenuInfoIcon = () => {
            return (
                <Icon
                    className={styles.menuInfoIcon}
                    iconType={IconType.info}
                    iconTheme={null}
                    width={16}
                />
            );
        };
        const openInfoPopup      = (popupType) => {
            return () => {
                const options = {
                    tradeId: betId,
                    eventId: eventId,
                };

                showPopup(popupType, options);
            };
        };

        return (
            <div className={styles.menu}>
                <Icon
                    className={styles.menuIcon}
                    iconType={IconType.menu}
                    iconTheme={null}
                    onClick={() => setMenuOpened(!menuOpened)}
                />
                <div
                    className={classNames(
                        styles.menuBox,
                        menuOpened ? styles.menuBoxOpened : null,
                    )}
                >
                    <div
                        className={styles.menuItem}
                        onClick={openInfoPopup(PopupTheme.eventDetails)}
                    >
                        {renderMenuInfoIcon()}
                        <span>
                            See <strong>Event</strong> Details
                        </span>
                    </div>
                    <div
                        className={styles.menuItem}
                        onClick={openInfoPopup(PopupTheme.tradeDetails)}
                    >
                        {renderMenuInfoIcon()}
                        <span>
                            See <strong>Trade</strong> Details
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const renderMyTrades = () => {
        if (!startPrice && !cashout && !prediction) {
            return null;
        }

        return (
            <>
                <hr />
                <div className={styles.myBetSection}>
                    <div>
                        <span className={styles.myBetLabel}>Startprice:</span>
                        <span>{startPrice} EVNT</span>
                    </div>
                    <div>
                        <span className={styles.myBetLabel}>Your Prediction:</span>
                        <span>{prediction}</span>
                    </div>
                    <hr />
                    <Button
                        className={classNames(styles.cashoutButton)}
                        onClick={
                            () => {}
                        }
                        highlightType={HighlightType.highlightHomeCtaBet}
                        highlightTheme={null}
                        // disabled={cashoutButtonDisabled}
                        disabledWithOverlay={false}
                    >
                        {`Cashout ${cashout} EVNT`}
                    </Button>
                </div>

            </>
        )
    }

    return (
        <div
            className={styles.relatedBetCard}
        >
            <div
                className={classNames(
                    styles.eventCardBackground,
                    showEventEnd ? styles.hasTimeLeftCounter : null,
                )}
                onClick={onClick}
            >
                <span className={styles.eventName}>
                    {eventName}
                </span>
                <span className={styles.title}>
                    {title}
                </span>
                <div className={styles.badgeContainer}>
                    <StateBadge state={status} />
                </div>

                {renderMyTrades()}

            </div>

            {renderMenuContainer()}
            {
                showEventEnd && (
                    <div className={styles.timeLeftCounterContainer}>
                        <span>End of Trade:</span>
                        <TimeLeftCounter endDate={endDate} />
                    </div>
                )
            }
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    const { userId } = ownProps;
    let user         = getDefaultUser();

    if (userId) {
        user = _.get(
            state.user.users,
            userId,
        );
    }

    return {
        user: user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showPopup: (popupType) => {
            dispatch(PopupActions.show(popupType));
        },
    };
}
;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RelatedBetCard);
