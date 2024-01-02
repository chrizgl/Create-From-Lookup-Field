import * as React from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { ICreateFromLookupProps } from '../interfaces/ICreateFromLookupProps';
import { ILookupDialogProps } from '../interfaces/ILookupDialogProps';
import LookupDialog from './SelectItemDialog';
import InputActionBar from './LookupMenuBar/LookupMenuBar';
import InputActionBarProvider from './CreateFromLookupProvider';

const CreateFromLookupApp = (props: ICreateFromLookupProps): JSX.Element => {
    const lookupDialogProps: ILookupDialogProps = {
        onChangeRequest: props.onChangeRequest,
        config: props.config,
    };
    const webApiComponentProps = {
        utils: props.utils,
        webApi: props.webApi,
        config: props.config,
    };

    return (
        <FluentProvider theme={webLightTheme}>
            <InputActionBarProvider>
                <InputActionBar {...props} />
                <LookupDialog {...lookupDialogProps} />
            </InputActionBarProvider>
        </FluentProvider>
    );
};
export default CreateFromLookupApp;
