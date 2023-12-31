import * as React from 'react';
import { useMemo, useContext } from 'react';
import { mergeClasses, FluentProvider, webLightTheme } from '@fluentui/react-components';
import { useStyles } from './Styles';
import { ICreateFromLookupProps } from '../interfaces/ICreateFromLookupProps';
import { ILookupDialogProps } from '../interfaces/ILookupDialogProps';
import LookupDialog from './SelectItemDialog';
import InputActionBar from './InputActionBar';
import InputActionBarContext from './InputActionBarContext';
import InputActionBarProvider from './InputActionBarProvider';

const CreateFromLookupApp = (props: ICreateFromLookupProps): JSX.Element => {
    const _props = props;

    // Styling specific code:
    const classes = useStyles();
    const stackClasses = mergeClasses(classes.stack, classes.stackHorizontal);

    const contextValue = useContext(InputActionBarContext);
    if (!contextValue) {
        throw new Error('LookupFieldApp: InputActionBarContext is not defined');
    }
    const lookupDialogState = contextValue.lookupDialogState;
    const setLookupDialogState = contextValue.setLookupDialogState;

    const lookupDialogProps: ILookupDialogProps = {
        onChangeRequest: _props.onChangeRequest,
        setLookupDialogState: setLookupDialogState,
        lookupDialogState: lookupDialogState,
        config: _props.config,
    };

    return (
        <FluentProvider theme={webLightTheme}>
            <InputActionBarProvider>
                <LookupDialog {...lookupDialogProps} />
                <InputActionBar {..._props} />
            </InputActionBarProvider>
        </FluentProvider>
    );
};
export default CreateFromLookupApp;
