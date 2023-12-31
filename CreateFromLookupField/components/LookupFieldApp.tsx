import * as React from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { ICreateFromLookupProps } from '../interfaces/ICreateFromLookupProps';
import { ILookupDialogProps } from '../interfaces/ILookupDialogProps';
import LookupDialog from './SelectItemDialog';
import InputActionBar from './InputActionBar';
import InputActionBarProvider from './InputActionBarProvider';
import LookupDialogProvider from './LookupDialogProvider';

const CreateFromLookupApp = (props: ICreateFromLookupProps): JSX.Element => {
    const _props = props;

    const lookupDialogProps: ILookupDialogProps = {
        onChangeRequest: _props.onChangeRequest,
        config: _props.config,
    };

    return (
        <FluentProvider theme={webLightTheme}>
            <LookupDialogProvider>
                <InputActionBarProvider>
                    <LookupDialog {...lookupDialogProps} />
                    <InputActionBar {..._props} />
                </InputActionBarProvider>
            </LookupDialogProvider>
        </FluentProvider>
    );
};
export default CreateFromLookupApp;
