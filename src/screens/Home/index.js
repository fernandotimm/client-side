import _                            from 'lodash';
import BaseContainerWithNavbar      from '../../components/BaseContainerWithNavbar';
import BetCard                      from '../../components/BetCard';
import CarouselContainer            from '../../components/CarouselContainer';
import FixedEventCreationIconButton from '../../components/FixedEventCreationIconButton';
import Header                       from '../../components/Header/index';
import LiveEventCarouselContainer   from '../../components/LiveEventCarouselContainer';
import Routes                       from '../../constants/Routes';
import styles                       from './styles.module.scss';
import { connect }                  from 'react-redux';
import { useHistory }               from 'react-router';
import BetState                     from '../../components/BetView/BetState';

const Home = ({ events, user }) => {
    const history = useHistory();

    const onEventClick = (eventId, betId = '') => {
        return () => {
            history.push(Routes.getRouteWithParameters(
                Routes.bet,
                {
                    eventId,
                    betId,
                },
            ));
        };
    };

    const renderMostPopularBets = () => {
        return _.map(
            events,
            (event, eventIndex) => {
                const bets = event.bets;

                return _.map(
                    bets,
                    (bet, betIndex) => {
                        const key        = eventIndex + '.' + betIndex;
                        const eventEnd   = new Date(_.get(bet, 'endDate'));
                        const tradeState = _.get(bet, 'status');

                        if (tradeState === BetState.active) {
                            return (
                                <BetCard
                                    key={key}
                                    image={event.previewImageUrl}
                                    userId={bet.creator}
                                    marketQuestion={bet.marketQuestion}
                                    hot={bet.hot}
                                    eventEnd={eventEnd}
                                    onClick={onEventClick(event._id, bet._id)}
                                />
                            );
                        }
                    },
                );
            },
        );
    };

    const renderEventCreationButton = () => {
        return (
            <FixedEventCreationIconButton />
        );
    };

    return (
        <BaseContainerWithNavbar>
            <Header events={events} />
            <LiveEventCarouselContainer />
            <CarouselContainer title={'🚀 Most popular Trades'}>
                {renderMostPopularBets()}
            </CarouselContainer>
            {renderEventCreationButton()}
        </BaseContainerWithNavbar>
    );
};

const mapStateToProps = (state) => {
    return {
        events: state.event.events,
        user:   state.authentication,
    };
};

export default connect(
    mapStateToProps,
    null,
)(Home);