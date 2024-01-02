import * as React from 'react';
import { useCallback, useContext } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { useStyles } from '../Styles';
import InputActionBarContext from '../CreateFromLookupContext';
import { ICreateFromLookupProps } from '../../interfaces/ICreateFromLookupProps';
import { IButtonState } from '../../interfaces/IButtonState';
import WebApiRequest from '../WebApiComponent';
import SearchField from './SearchField';
import SearchButton from './SearchButton';
import CreateButton from './CreateButton';
import OpenButton from './OpenButton';

const SEARCH_DELAY = 1000;

const LookupMenuBar: React.FC<ICreateFromLookupProps> = (props) => {
    const webApiRequest = WebApiRequest({ utils: props.utils, webApi: props.webApi, config: props.config });
    const openOnSidePane = props.openOnSidePane;

    const contextValue = useContext(InputActionBarContext);
    if (!contextValue) {
        throw new Error('InputActionBarContext is undefined');
    }
    const inputValue = contextValue.inputValue;
    const validInputState = contextValue.validInputState;
    const searchState = contextValue.searchState;
    const setSearchState = contextValue.setSearchState;
    const openState = contextValue.openState;
    const createState = contextValue.createState;
    const setCreateState = contextValue.setCreateState;
    const createEnabledState = contextValue.createEnabledState;
    const setCreateEnabledState = contextValue.setCreateEnabledState;
    const setLookupDialogState = contextValue.setLookupDialogState;

    const classes = useStyles();
    const stackClasses = mergeClasses(classes.stack, classes.stackHorizontal);
    const overflowClass = mergeClasses(classes.overflow, classes.stackitem);
    const iconClass = mergeClasses(classes.icon, classes.stackitem);

    const handleSearch = useCallback(async () => {
        webApiRequest.retrieveRecords(inputValue).then((result) => {
            if (result) {
                const foundRef = result.hasFound;
                if (!foundRef) {
                    setCreateEnabledState(true);
                } else {
                    setLookupDialogState((state) => ({ ...state, values: result.lookupValues, open: true }));
                    setCreateEnabledState(false);
                }
            }
        });
    }, [inputValue, setCreateEnabledState, setLookupDialogState, webApiRequest]);

    const onClickSearchRequest = useCallback(() => {
        setSearchState((state: IButtonState) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
        setTimeout(() => {
            setSearchState((state: IButtonState) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
        }, SEARCH_DELAY);
        if (validInputState) {
            handleSearch();
        }
    }, [handleSearch, setSearchState, validInputState]);

    const handleCreate = useCallback(async () => {
        const result = await webApiRequest.createRecord(inputValue);
        if (result) {
            setCreateEnabledState(!result.lookupValue);
            if (result.lookupValue) {
                props.onChangeRequest(result.lookupValue);
            }
        }
    }, [webApiRequest, inputValue, props, setCreateEnabledState]);

    const onClickCreateRequest = useCallback(() => {
        setCreateState((state: IButtonState) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
        setTimeout(() => {
            setCreateState((state: IButtonState) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
        }, SEARCH_DELAY);
        handleCreate();
    }, [handleCreate, setCreateState]);

    const onClickOpenRequest = useCallback(() => {
        console.log('onClickOpenRequest');
        openOnSidePane.openOnSidePane(props.lookupValue);
    }, [openOnSidePane, props.lookupValue]);

    return (
        <div className={stackClasses}>
            <SearchField {...{ onClickSearchRequest }} />
            <SearchButton {...{ onClickSearchRequest }} />
            <CreateButton {...{ onClickCreateRequest }} />
            {props.lookupValue && <OpenButton {...{ onClickOpenRequest }} />}
        </div>
    );
};
export default LookupMenuBar;
