import _ from 'lodash';
import React, {PropTypes, Component} from 'react'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

export default class Field extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.onCheckBoxCheck = this.onCheckBoxCheck.bind(this);
    }

    updateValue(value) {
        const {updateValue, name} = this.props;
        updateValue(name, value);
    }

    onChange(event) {
        this.updateValue(event.target.value);
    }

    onCheckBoxCheck(event, value) {
        this.updateValue(value)
    }
    render() {
        const {style, hint, label, name, type, ...other} = this.props;
        let value = _.get(this.context.search, name);
        let element;
        switch (type) {
            case 'boolean':
                element = (
                    <Checkbox
                        label={label}
                        checked={value}
                        onCheck={this.onCheckBoxCheck}
                        {...other}
                        style={style}/>
                );
                break;
            default :
                element = (<TextField
                    style={style}
                    hintText={hint}
                    floatingLabelText={label}
                    value={value}
                    defaultValue={value}
                    onChange={this.onChange}
                    type={type}
                    {...other}
                />)
        }
        return element;
    }
}

Field.propTypes = {
    style: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    updateValue: PropTypes.func.isRequired,
    hint: PropTypes.string
};
Field.contextTypes = {
    search: PropTypes.object.isRequired
};