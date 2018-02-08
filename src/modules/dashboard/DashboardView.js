import React, {PropTypes, Component} from 'react';
import {
    NavigationExperimental,
    View,
    Navigator,
    Text,
    Button,
    StyleSheet,
    StatusBar,
    Platform,
    TouchableHighlight,
    Image,
    ActivityIndicator
} from 'react-native';
import Dimensions from 'Dimensions';
import Drawer from 'react-native-drawer'
import DrawerView from '../../components/DrawerView'
import AppRouter from '../AppRouter';
import TabBar from '../../components/TabBar';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import RealmDatabase from '../../database/RealmDatabase';

const {
    CardStack: NavigationCardStack,
    Header: NavigationHeader,
    PropTypes: NavigationPropTypes
} = NavigationExperimental;

// Customize bottom tab bar height here if desired
const TAB_BAR_HEIGHT = 0;

class DashboardView extends Component {

    static displayName = 'DashboardView';

    static propTypes = {
        dashboardState: PropTypes.shape({
            tabs: PropTypes.shape({
                routes: PropTypes.arrayOf(PropTypes.shape({
                    key: PropTypes.string.isRequired,
                    title: PropTypes.string.isRequired
                })).isRequired
            }).isRequired,
            DashboardTab: NavigationPropTypes.navigationState.isRequired,
            ProfileTab: NavigationPropTypes.navigationState.isRequired,
            LeavesTab: NavigationPropTypes.navigationState.isRequired,
            WorkFromHomeTab: NavigationPropTypes.navigationState.isRequired,
            LeavesHistoryTab: NavigationPropTypes.navigationState.isRequired,
            loading: PropTypes.bool.isRequired
        }),
        switchTab: PropTypes.func.isRequired,
        pushRoute: PropTypes.func.isRequired,
        popRoute: PropTypes.func.isRequired
    };

    renderHeader = (sceneProps) => {
        let userData = RealmDatabase.findUser()[0];
        return (<View>
                <StatusBar
                    backgroundColor="#5933EA"
                    barStyle="light-content"
                />
                <LinearGradient
                    start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
                    locations={[0.0,0.5,1.0]}
                    colors={['#48E2FF', '#508FF5', '#5933EA']}
                    style={Platform.OS === 'ios' ?styles.linearGradientWithPadding:styles.linearGradientWithoutPadding}>
                    <View style={styles.header}>
                        <TouchableHighlight style={{width:40,marginTop:5,height:40}} underlayColor="transparent" onPress={()=>{
                           if(sceneProps.scene.route.title==="Timeline"){
                            this.openControlPanel()
                           }else{
                             this.props.popRoute();
                           }
//                                this.props.switchTab(0);
                                //sceneProps.switchTab(1);
                        }}>
                            <Icon
                                size={20}
                                color='#fff'
                                name= {sceneProps.scene.route.title==="Timeline"?"navicon":"angle-left"}//"angle-left" //navicon
                                style={{alignSelf:"center",marginTop:8,backgroundColor:"transparent",paddingRight:10}}
                            />
                        </TouchableHighlight>
                        <Text
                            style={{flex:1,backgroundColor:"transparent", textAlign:'center',color:"#ffffff",fontSize:18,marginTop:10}}>{sceneProps.scene.route.title}</Text>
                        <TouchableHighlight underlayColor="transparent" onPress={()=>{
                                this.props.pushRoute({key: 'ProfileTab', title: 'Profile'});
//                                this.props.switchTab(1);
                                //sceneProps.switchTab(1);
                        }}>
                            <Image style={ styles.image } source={{ uri: userData.image_link }}/>

                        </TouchableHighlight>
                    </View>
                </LinearGradient>
                {this.props.dashboardState.loading && 
                    <View style={[styles.overlay, { height: Dimensions.get('window').height}]}>
                        <ActivityIndicator animating={this.props.dashboardState.loading} style={[styles.centering, {height: 80}]} size="large"/>
                    </View>
                }
            </View>
        );
    };

    closeControlPanel = () => {
        this._drawer.close()
    };
    openControlPanel = () => {
        this._drawer.open()
    };

    renderScene = (sceneProps) => {
        return (
            <View style={styles.sceneContainer}>
                {AppRouter(sceneProps,this.props.pushRoute)}
            </View>
        );
    };

    render() {
        const {tabs} = this.props.dashboardState;
        const tabKey = tabs.routes[tabs.index].key;
        const scenes = this.props.dashboardState[tabKey];
        return (
                <Drawer
                    type="displace"
                    tapToClose={true}
                    openDrawerOffset={0.3} // 20% gap on the right side of drawer
                    panCloseMask={0.3}
                    acceptPan={true}
                    closedDrawerOffset={0}
                    styles={drawerStyles}
                    acceptPan={false}
                    tweenHandler={(ratio) => ({
                    main: { opacity:(2-ratio)/2 }
                    })}
                    ref = {(ref) => this._drawer = ref}
                    content={<DrawerView pushRoute = {this.props.pushRoute} closeFunction = {this._drawer} />}
                >
                <View style={styles.container}>
                <NavigationCardStack
                    key={'stack_' + tabKey}
                    // onNavigateBack={this.props.onNavigateBack}
                    navigationState={scenes}
                    renderHeader={this.renderHeader}
                    renderScene={this.renderScene}
                />
                </View>
               </Drawer>
        );
    }
}

// <TabBar
//     style={{opacity:0,height:0,width:0}}
//     height={TAB_BAR_HEIGHT}
//     tabs={tabs}
//     currentTabIndex={tabs.index}
//     switchTab={this.props.switchTab}
// />

const styles = StyleSheet.create({
    image: {
        height: 40,
        marginTop: 5,
        width: 40,
        borderRadius: 20
    },
    header: {
        margin:0,
        padding:0,
        flexDirection: 'row'
    },
    linearGradientWithPadding: {
        height: 70,
        paddingTop: 20,
        elevation: 5,
        backgroundColor: "transparent",
        paddingLeft: 10,
        paddingRight: 10
    },
    linearGradientWithoutPadding: {
        height: 50,
        elevation: 5,
        backgroundColor: "transparent",
        paddingLeft: 10,
        paddingRight: 10
    },
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#48E2FF"
    },
    sceneContainer: {
        flex: 1,
        backgroundColor: "#48E2FF",
        marginBottom: TAB_BAR_HEIGHT
    }, overlay: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        //alignItems: 'center',
        left: 0,
        top: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        width: Dimensions.get('window').width
    }
});

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.6, shadowRadius: 5,margin:0},
    main: {padding:0}
}

export default DashboardView;
