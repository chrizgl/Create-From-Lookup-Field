import * as React from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { ICreateFromLookupProps } from '../interfaces/ICreateFromLookupProps';
import { ILookupDialogProps } from '../interfaces/ILookupDialogProps';
import LookupDialog from './SelectItemDialog';
import InputActionBar from './InputActionBar';
import InputActionBarProvider from './InputActionBarProvider';

const CreateFromLookupApp = (props: ICreateFromLookupProps): JSX.Element => {
    const _props = props;
    console.log('CreateFromLookupApp: ' + _props.lookupValue);

    const lookupDialogProps: ILookupDialogProps = {
        onChangeRequest: _props.onChangeRequest,
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
