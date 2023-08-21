import React from 'react'; // Import react
import { // Import react native components
  StyleSheet,
  ActivityIndicator,

} from 'react-native'; 

import Toast from 'react-native-toast-message'; // Import Toast message


class ToasterLoader extends React.Component { // ToasterLoader class 

    constructor(props) // Default constructor
    {
        super(props); // Call default constructor
        this.state = { // Initialize state
            toast: false // Set toast to false
        }
    }

  

    render()
    {
        return (
            <>
                {/* Toast message */}
                <Toast
                    visible={this.props.toast} // Set visible to toast
                    position={'bottom'} // Set position to bottom
                    backgroundColor={'#E16160'} // Set background color to #E16160
                    message={this.props.toast_message} // Set message to toast message
                    showLoader={this.props.toast_loader} // Set show loader to toast loader

                />
                {this.props.loading && <ActivityIndicator backgroundColor={'rgba(0,0,0,.4)'} color={'white'} overlay/>}
            </>
        );
    }
};

const styles = StyleSheet.create({
    container : {
        backgroundColor: '#F4EFE9',
        height: '100%'
    },  
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default ToasterLoader;
