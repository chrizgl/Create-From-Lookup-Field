import * as React from 'react';
import { useState, useCallback, useMemo, useEffect, useContext } from 'react'; // avoid re-rendering
import { AddCircle32Regular, AddCircle32Filled, Search32Regular, Search32Filled, Open32Regular, Open32Filled } from '@fluentui/react-icons';
import { mergeClasses, Button, FluentProvider, webLightTheme, Input, InputProps, useId } from '@fluentui/react-components';
import { useStyles } from './Styles';
import { ICreateFromLookupProps } from '../interfaces/ICreateFromLookupProps';
import { IButtonState } from '../interfaces/IButtonState';
import { ILookupDialogProps } from '../interfaces/ILookupDialogProps';
import { ILookupDialogState } from '../interfaces/ILookupDialogState';
import WebApiRequest from './WebApiComponent';
import LookupDialog from './SelectItemDialog';
import LookupFieldProvider from './InputActionBarProvider';

const CreateFromLookupApp = (props: ICreateFromLookupProps): JSX.Element => {
    const _props = useMemo(() => props, [props]);
    const webApiRequest = WebApiRequest({ utils: _props.utils, webApi: _props.webApi, config: _props.config });
    const openOnSidePane = _props.openOnSidePane;
    const inputValue = '';
    // Styling specific code:
    const classes = useStyles();
    const stackClasses = mergeClasses(classes.stack, classes.stackHorizontal);
    const overflowClass = mergeClasses(classes.overflow, classes.stackitem);
    const iconClass = mergeClasses(classes.icon, classes.stackitem);

    const lookupDialogProps: ILookupDialogProps = {
        onChangeRequest: _props.onChangeRequest,
        setLookupDialogState: setLookupDialogState,
        lookupDialogState: lookupDialogState,
        config: _props.config,
    };

    return (
        <FluentProvider theme={webLightTheme}>
            <LookupDialog {...lookupDialogProps} />
            <div className={stackClasses}>
                <LookupFieldProvider>
                    <InputWithLookupContext />
                </LookupFieldProvider>
                {validInputState && (
                    <>
                        <Button className={classes.stackitem} icon={showSearchButton()} onClick={onClickSearchRequest} />
                    </>
                )}
                {_props.lookupValue && (
                    <>
                        <Button className={classes.stackitem} icon={showOpenButton()} onClick={onClickOpenRequest} />
                    </>
                )}
            </div>
        </FluentProvider>
    );
};
export default CreateFromLookupApp;
