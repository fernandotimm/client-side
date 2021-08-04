import 'react-responsive-carousel/lib/styles/carousel.min.css';
import _                            from 'lodash';
import darkModeLogo                 from '../../data/images/logo-demo.svg';
import FixedIconButton              from '../../components/FixedIconButton';
import IconType                     from '../../components/Icon/IconType';
import Link                         from '../../components/Link';
import LiveBadge                    from 'components/LiveBadge';
import Routes                       from '../../constants/Routes';
import styles                       from './styles.module.scss';
import TimeLeftCounter              from 'components/TimeLeftCounter';
import ViewerBadge                  from 'components/ViewerBadge';
import HotBetBadge                  from 'components/HotBetBadge';
import { Carousel }                 from 'react-responsive-carousel';
import { connect }                  from 'react-redux';
import { PopupActions }             from '../../store/actions/popup';
import { useParams }                from 'react-router-dom';
import { useSelector }              from 'react-redux';
import { useState }                 from 'react';
import TwitchEmbedVideo             from '../../components/TwitchEmbedVideo';
import BetView                      from '../../components/BetView';
import RelatedBetCard               from '../../components/RelatedBetCard';
import { useHistory }               from 'react-router-dom';
import Chat                         from '../../components/Chat';
import FixedEventCreationIconButton from '../../components/FixedEventCreationIconButton';
import { SwiperSlide, Swiper }      from 'swiper/react';
import React                        from 'react';
import Navbar from 'components/Navbar';
import Icon from 'components/Icon';
import SwitchableHelper from 'helper/SwitchableHelper';
import SwitchableContainer from 'components/SwitchableContainer';
import HotBetBadgeTheme from 'components/HotBetBadge/HotBetBadgeTheme';

const Bet = ({ showPopup, user }) => {
          const history                           = useHistory();
          const [swiper, setSwiper]               = useState(null);
          const { eventId, betId }                = useParams();
          const [currentSlide, setCurrentSlide]   = useState(0);
          const [tradeTabIndex, setTradeTabIndex] = useState(0);
          const [chatTabIndex, setChatTabIndex] = useState(0);

          const event = useSelector(
              (state) => _.find(
                  state.event.events,
                  {
                      _id: eventId,
                  },
              ),
          );

          const moveToSlide = (index) => {
              if (swiper) {
                  swiper.slideTo(index);
              }
          };

          const renderChatButton = () => {
              return (
                  <FixedIconButton
                      className={styles.fixedChatButton}
                      onClick={() => moveToSlide(1)}
                      iconType={IconType.chat}
                      left={true}
                  />
              );
          };

          const renderEventCreationButton = () => {
              return (
                  <FixedEventCreationIconButton
                      eventId={eventId}
                  />
              );
          };

          const getRelatedBets = () => {
              return _.get(event, 'bets', []);
          };

          const renderRelatedBetList = () => {
              return _.map(
                  getRelatedBets(),
                  (bet, index) => {
                      return renderRelatedBetCard(bet, index);
                  },
              );
          };

          const onBetClick = (betId) => {
              return () => {
                  const eventId = _.get(event, '_id', null);

                  history.push(Routes.getRouteWithParameters(
                      Routes.bet,
                      {
                          eventId,
                          betId,
                      },
                  ));
              };
          };

          const onBackToAllTradesClick = () => {
            return () => {
                const eventId = _.get(event, '_id', null);

                history.push(Routes.getRouteWithParameters(
                    Routes.bet,
                    {
                        eventId,
                        betId: ''
                    },
                ));
            };
        };

          const renderRelatedBetCard = (bet, index) => {
              if (bet) {
                  const betId = _.get(bet, '_id');
                  const eventId = _.get(event, '_id', null);

                  return (
                      <RelatedBetCard
                          key={index}
                          betId={betId}
                          eventId={eventId}
                          title={bet.marketQuestion}
                          eventName={event.name}
                          endDate={bet.endDate}
                          userId={bet.creator}
                          onClick={onBetClick(betId)}
                          showEventEnd={true}
                          status={bet.status}
                      />
                  );
              }

              return <div />;
          };

          const renderMyBetCard = (bet, index) => {
            if (bet) {
                const betId = _.get(bet, '_id');
                const eventId = _.get(event, '_id', null);

                return (
                    <RelatedBetCard
                        key={index}
                        betId={betId}
                        eventId={eventId}
                        title={bet.marketQuestion}
                        eventName={event.name}
                        endDate={bet.endDate}
                        userId={bet.creator}
                        onClick={onBetClick(betId)}
                        showEventEnd={true}
                        status={bet.status}
                        startPrice={1000} //TODO
                        prediction={'Wallfair Snail'} //TODO
                        cashout={'6.000'} //TODO
                    />
                );
            }

            return <div />;
        };

        const renderRelatedBets = () => {
            const bets = getRelatedBets();

            return (
                <div>
                { bets.map((bet, index) => renderRelatedBetCard(bet, index)) }
                </div>
            );
        };

        const renderMyBets = () => {
            const bets = getRelatedBets();

            return (
                <div>
                { bets.map((bet, index) => renderMyBetCard(bet, index)) }
                </div>
            );
        };

        const renderBets = () => {
            if (tradeTabIndex === 1) {
                return renderMyBets();
            }

            return renderRelatedBets();
        }

        const renderMobileMenuIndicator = (index) => {
            return (
                <span
                    className={currentSlide === index ? styles.active : ''}
                    onClick={() => {
                        setCurrentSlide(index);
                    }}
                >
                </span>
            );
        };

        const renderSwitchableView = (tabs = [], tabIndexState = 0, tabIndexStateSetter) => {
            const switchableViews = tabs.map(({name, iconType = null, iconTheme = null}) => {
                return SwitchableHelper.getSwitchableView(name, iconType, iconTheme);
            });

            return (
                <SwitchableContainer
                    className={styles.switchableViewContainer}
                    whiteBackground={false}
                    fullWidth={false}
                    switchableViews={switchableViews}
                    currentIndex={tabIndexState}
                    setCurrentIndex={tabIndexStateSetter}
                />
            );
        };

          if (!event) {
              return null;
          }

          return (
              <div className={styles.bet}>
                  {/* <div className={styles.upperLeftOval}>
                  </div> */}
                  <div className={styles.rightBottomOval}>
                  </div>

                  <div className={styles.row}>
                      <div className={styles.columnLeft}>
                        <Navbar user={user} internal={true} />
                        <div className={styles.headlineContainer}>
                            <div>
                                <Link
                                    to={Routes.home}
                                    className={styles.arrowBack}
                                >
                                </Link>
                                <div className={styles.headline}>
                                    <h1>
                                        {_.get(event, 'name')}
                                    </h1>
                                    <div>
                                        <LiveBadge />
                                        <ViewerBadge viewers={1123} />
                                        <HotBetBadge theme={HotBetBadgeTheme.whiteOpacity13} label="208.554 EVNT" />
                                        <HotBetBadge theme={HotBetBadgeTheme.opacity01} label="Hot Event" />
                                    </div>
                                </div>
                            </div>
                        </div>
                          <div className={styles.streamContainer}>
                              <TwitchEmbedVideo
                                  video={event.streamUrl}
                              />
                              <div className={styles.timeLeft}>
                                  <span>
                                      End of Event:
                                  </span>
                                  <TimeLeftCounter endDate={new Date(_.get(event, 'endDate'))} />
                              </div>
                          </div>
                          {
                            renderSwitchableView(
                                [
                                    { name: 'Stream Chat' },
                                    { name: 'Related Trades' }
                                ],
                                chatTabIndex,
                                setChatTabIndex
                            )
                          }
                          <Chat
                              className={styles.desktopChat}
                              event={event}
                          />
                          <div className={styles.mobileCarousel}>
                              <Swiper
                                  slidesPerView={1}
                                  pagination={{
                                      'clickable': false,
                                  }}
                                  autoHeight={true}
                                  onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
                                  onSwiper={setSwiper}
                              >
                                  <SwiperSlide className={styles.carouselSlide}>
                                      <BetView
                                          closed={false}
                                          showEventEnd={true}
                                      />
                                  </SwiperSlide>
                                  <SwiperSlide className={styles.carouselSlide}>
                                      <Chat
                                          event={event}
                                          className={styles.mobileChat}
                                      />
                                  </SwiperSlide>
                                  <SwiperSlide className={styles.carouselSlide}>
                                      <div
                                          className={styles.headline}
                                          style={{ flexDirection: 'row', display: 'flex', marginBottom: '1rem', alignItems: 'center' }}
                                      >
                                          <h2 style={{ fontSize: '16px', marginRight: '0.5rem' }}>🚀 Related Bets</h2>
                                          <LiveBadge />
                                      </div>
                                      <div>
                                          {renderRelatedBetList()}
                                      </div>
                                  </SwiperSlide>
                              </Swiper>
                          </div>
                      </div>
                      <div className={styles.columnRight}>

                          <div>
                            <Icon
                                className={styles.decreaseIcon}
                                iconType={IconType.arrow}
                                // onClick={}
                            />

                            { !betId ? <>
                                { renderSwitchableView(
                                    [
                                        { name: 'Event Trades' },
                                        { name: 'My Trades' }
                                    ],
                                    tradeTabIndex,
                                    setTradeTabIndex
                                ) }
                                <div className={styles.relatedBets}>
                                    { renderBets() }
                                </div>
                            </>
                            :
                            <>
                                <div
                                    className={styles.backToAllTrades}
                                    onClick={onBackToAllTradesClick()}
                                >
                                    <Icon
                                        className={styles.backIcon}
                                        iconType={IconType.arrowSimple}
                                    />
                                    <span>Go back to all Trades</span>
                                </div>

                                <BetView
                                    closed={false}
                                    showEventEnd={true}
                                />
                            </>
                            }

                          </div>
                      </div>
                  </div>
                  <div className={styles.mobileMenu}>
                      <div className={styles.indicators}>
                          {renderMobileMenuIndicator(0)}
                          {renderMobileMenuIndicator(1)}
                          {renderMobileMenuIndicator(2)}
                      </div>
                  </div>
                  {renderEventCreationButton()}
                  {renderChatButton()}
              </div>
          );
      }
;

const mapStateToProps = (state) => {
    return {
        user: state.authentication,
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
)(Bet);
