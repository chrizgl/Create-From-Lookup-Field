import * as React from 'react';
import { useMemo, useContext, useState } from 'react';
import { mergeClasses, FluentProvider, webLightTheme } from '@fluentui/react-components';
import { useStyles } from './Styles';
import { ICreateFromLookupProps } from '../interfaces/ICreateFromLookupProps';
import { ILookupDialogProps } from '../interfaces/ILookupDialogProps';
import LookupDialog from './SelectItemDialog';
import InputActionBar from './InputActionBar';
import InputActionBarContext from './InputActionBarContext';
import InputActionBarProvider from './InputActionBarProvider';
import { ILookupDialogState } from '../interfaces/ILookupDialogState';

const CreateFromLookupApp = (props: ICreateFromLookupProps): JSX.Element => {
    const _props = props;

    // Styling specific code:
    const classes = useStyles();
    const stackClasses = mergeClasses(classes.stack, classes.stackHorizontal);

    const [lookupDialogState, setLookupDialogState] = useState<ILookupDialogState>({
        values: new Object() as ComponentFramework.WebApi.RetrieveMultipleResponse,
        open: false,
        selectedItem: [],
    });

    const lookupDialogProps: ILookupDialogProps = {
        onChangeRequest: _props.onChangeRequest,
        setLookupDialogState: setLookupDialogState,
        lookupDialogState: lookupDialogState,
        config: _props.config,
    };

    const contextValue = {
        lookupDialogState,
        setLookupDialogState,
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
