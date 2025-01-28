
/////////////////////////////////////////////
// Standard's

import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { collection, query, onSnapshot, startAt, endAt, orderBy, QueryOrderByConstraint, OrderByDirection, limit, where, QueryNonFilterConstraint, QueryConstraint, QueryConstraintType } from 'firebase/firestore'


/////////////////////////////////////////////
// Application's

import { db } from '../firebase/config'
import { XTSObject } from '../data-objects/types-common'
import { getXTSClass } from '../data-objects/common-use'
import { getXTSSlice } from '../data-storage/xts-mappings'
import { RootState } from '../data-storage'
import { Unsubscribe } from '@reduxjs/toolkit'

// import { actions as actions_Current } from '../data-storage/slice-current'
// import { MIN_SEARCH_LENGTH, PAGE_ITEMS } from '../commons/constants'
// import { getXTSSlice } from '../data-storage/xts-mappings'
// import { RootState } from '../data-storage'
// import { compareFunction, compareXTSValues, createXTSObject, isEmptyObjectId } from '../data-objects/common-use'
// import { XTSObject, XTSObjectId, XTSRecordFilter, XTSRecordKey } from '../data-objects/types-common'
// import { XTSItemValue } from '../data-objects/types-form'
// import { ITEM_VALUE_ACTIONS, USAGE_MODES } from '../data-objects/types-components'
// import { requestData_DownloadObjectList, requestData_GetObject, requestData_GetObjectList, requestData_GetRecordSet } from '../data-objects/request-data'
// import { arrayFilter, arraySort, generateUUID } from '../commons/common-use'
// import { fillDefaultValues } from '../data-objects/default-values'
// import { PAGE_ACTIONS, REQUEST_STATUSES } from '../commons/enums'

/////////////////////////////////////////////
// Object'

export interface UseAppDataObjectsParams {
    dataType: string
    sliceName: string
    collectionName: string
    limit: number
    orderBy: string,
    orderByDirection: string,       // 'asc' | 'desc'
}

export function useAppDataObjects(params: UseAppDataObjectsParams) {

    const dispatch = useDispatch()
    const { idToken } = useSelector(((state: RootState) => state.session))
    const _orderByDirection = (params.orderByDirection === 'desc') && 'desc' || 'asc'
    useEffect(() => {

        const queryConstraint: QueryConstraint[] = []
        queryConstraint.push(limit(params.limit))
        queryConstraint.push(orderBy(params.orderBy, _orderByDirection))
        // if (!accessToken) {
        //     queryConstraint.push(where('company.id', '==', ''))
        // }

        // const q = query(_collection, _limit, _orderBy, _where)
        const q = query(
            collection(db, params.collectionName),
            ...queryConstraint)

        // const unsubscribe = onSnapshot(q, (querySnapshot) => {
        //     const itemsList: Item[] = [];
        //     querySnapshot.forEach((doc) => {
        //         itemsList.push({ ...doc.data(), id: doc.id } as Item);
        //         console.log("Kiểu dữ liệu của ID:", typeof doc.id)
        //         console.log("Độ dài của ID:", doc.id.length)
        //         console.log("doc: ", doc)
        //     });
        //     setItems(itemsList);
        // });

        const { sliceName, apiRequest, actions } = getXTSSlice(params.dataType)

        let unsubscribe: Unsubscribe | undefined = undefined
        if (idToken) {
            unsubscribe = onSnapshot(q, (snapshot) => {
                if (snapshot.metadata.hasPendingWrites) {
                    console.log("Local change, not yet synced to server.")
                } else {
                    //   console.log("Change from server.")
                    const updateableItems: XTSObject[] = []
                    const removeableItems: XTSObject[] = []
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            updateableItems.push(change.doc.data() as XTSObject)
                        } else if (change.type === 'modified') {
                            // updateableItems.push({ id: change.doc.id, ...change.doc.data() })
                            updateableItems.push(change.doc.data() as XTSObject)
                        } else if (change.type === 'removed') {
                            // itemsList.push({ id: change.doc.id, ...change.doc.data() })
                            removeableItems.push(change.doc.data() as XTSObject)
                        }
                        // console.log('change.doc.data()', change.doc.data())
                        // console.log('accessToken:', accessToken)
                    })
                    if (updateableItems.length > 0) {
                        dispatch(actions.update(updateableItems))
                    }
                    if (removeableItems.length > 0) {
                        dispatch(actions.remove(removeableItems))
                    }
                }
            })
        }

        // Cleanup when component unmount
        return () => {
            if (unsubscribe !== undefined) {
                unsubscribe()
            }
        }
    }, [params.limit, idToken])
}
