var React = require('react');
var createClass = require('create-react-class');
var VegaDNSConfig = require('../utils/VegaDNSConfig');
var VegaDNSClient = require('../utils/VegaDNSClient');
var VegaDNSActions = require('../actions/VegaDNSActions');

var About = React.createClass({
    getInitialState: function() {
        return {
            apiRelease: "",
            loaded: false
        }
    },

    componentDidMount: function() {
        this.getApiReleaseVersion();
    },

    getApiReleaseVersion: function() {
        VegaDNSClient.releaseVersion().success(data => {
            this.setState({
                loaded: true,
                apiRelease: data.release_version
            });
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to retrieve api release: ",
                data
            );
        });
    },

    render: function() {
        let apiRelease = "checking ...";
        if (this.state.loaded) {
            apiRelease = this.state.apiRelease;
        }
        return (
            <section id="about">
                <div className="row">
                    <div className="col-md-offset-4 col-md-4">
                        <h4>
                        VegaDNS-UI Release:  {VegaDNSConfig.uiRelease}<br />
                        VegaDNS-API Release:  {this.state.apiRelease}<br /><br />

                        For more information, see <a href="http://vegadns.org">vegadns.org</a>
                        </h4>
                    </div>
                </div>
            </section>
        );
    }
});

export default About;
