import * as React from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { ICreateFromLookupProps } from '../interfaces/ICreateFromLookupProps';
import { ILookupDialogProps } from '../interfaces/ILookupDialogProps';
import LookupDialog from './SelectItemDialog';
import InputActionBar from './InputActionBar';
import InputActionBarProvider from './InputActionBarProvider';
import SearchField from './SearchField';
import { useStyles } from './Styles';
import { mergeClasses } from '@fluentui/react-components';

const CreateFromLookupApp = (props: ICreateFromLookupProps): JSX.Element => {
    const _props = props;
    const classes = useStyles();
    const stackClasses = mergeClasses(classes.stack, classes.stackHorizontal);

    const lookupDialogProps: ILookupDialogProps = {
        onChangeRequest: _props.onChangeRequest,
        config: _props.config,
    };
    const webApiComponentProps = {
        utils: _props.utils,
        webApi: _props.webApi,
        config: _props.config,
    };

    return (
        <FluentProvider theme={webLightTheme}>
            <InputActionBarProvider props={webApiComponentProps}>
                <InputActionBar {..._props} />
                <LookupDialog {...lookupDialogProps} />
            </InputActionBarProvider>
        </FluentProvider>
    );
};
export default CreateFromLookupApp;
