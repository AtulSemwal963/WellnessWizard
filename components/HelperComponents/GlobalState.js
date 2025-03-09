
import { createGlobalState } from "react-hooks-global-state";

const initialState = {
  lastVisitedTab: "",
  diseaseDetailVisitCount: 0,
  archivedChatsRealmInstance: null,
  personalInformationRealmInstance:null,
  wellnessTrackersRealmInstance:null,
  selectedItem: null,
  shouldRefreshArchivedChats: 0,
  waterIntakeRecord:[]
};

const { setGlobalState, useGlobalState } = createGlobalState(initialState);



export {
  useGlobalState,
  setGlobalState,
};
