import {useQuery} from "react-query";

export const publicKey = process.env.REACT_APP_PUBLIC_KEY;

export const sodiApi = {
    map: {
        searchResultList: async (keyword, props = {}) => {
            console.log(keyword,  props)
            let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${keyword}.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=${publicKey}`;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return fetch(url).then(result => result.json());
        }
    }
};
