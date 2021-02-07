import { useEffect, useState } from "react";
import { Button, Input, Label } from "reactstrap";
import CardPokemon from "../../components/cardPokemon/cardPokemon";
import api from "../../services/api";
import pokemon from "../../assets/img/pokemon.png"
import fundo from "../../assets/img/fundo.png"
import InfiniteScroll from "react-infinite-scroll-component";
import { AutoSuggest } from 'react-autosuggestions';

export default function Home() {
    const [listPokemon, setListPokemon] = useState([]);
    const [listability, setListAbility] = useState([]);
    const [listPokemonHtml, setListPokemonHtml] = useState(null);
    const [getList, setGetList] = useState(0)
    const [filter, setFilter] = useState('')
    const [filterAbility, setFilterAbility] = useState('')

    useEffect(async () => {
        await fetchMoreData();
        await getAllAbility();
    }, []);

    async function getAllAbility() {
        let ret = await api.get('ability/?offset=0&limit=327');
        if (ret.data) {
            let abilitys = ret.data.results.map((x) => { return x.name })
            setListAbility(abilitys)
        }
    }

    async function GetThePokemon() {
        const ret = await api.get('pokemon/?limit=20&offset=' + getList);
        return ret.data.results;
    }

    async function GetPokemonByAbility() {
        if (filterAbility) {
            let ret = await api.get('ability/' + filterAbility);
            if (ret.data.pokemon) {
                listFilterAbility(ret.data.pokemon);
            }
        }
        else {
            GetThePokemon();
            setListPokemonHtml(null);
        }
    }
    function listFilterAbility(ret) {
        let html = (<>
            {ret.map((x) => {
                let id = (x.pokemon.url).split('/')[(x.pokemon.url).split('/').length - 2];
                return <CardPokemon name={x.pokemon.name} number={id} />
            })}

        </>);
        setListPokemonHtml(html);
    }

    async function GetPokemonByIdOrName() {
        if (filter) {
            let ret = await api.get('pokemon/' + filter);
            if (ret)
                listFilter(ret);
        }
        else {
            GetThePokemon();
            setListPokemonHtml(null);
        }
    }
    function listFilter(ret) {
        let html = (<>
            <CardPokemon name={ret.data.name} number={ret.data.id} />
        </>);
        setListPokemonHtml(html);
    }

    async function fetchMoreData() {
        let ret = await GetThePokemon();

        let arr = listPokemon.concat(ret);
        setListPokemon(arr);
        setGetList(getList + 20);
    };

    return (
        <div className="home">
            <img src={fundo} alt="fundo" className="fundo" />
            <img src={pokemon} alt="logo" width="400" />
            <div className="filter">
                <div className="filterPokemon">
                    <Label>Nome ou Número:</Label>
                    <Input className="inputFilter" value={filter} onChange={(e) => setFilter(e.target.value)} />
                    <Button className="btnFilter" onClick={() => GetPokemonByIdOrName()} >🔎 Buscar</Button>
                </div>
                <div className="filterAbility">
                <Label>Habilidade:</Label>
                    <AutoSuggest
                        name="Ability"
                        className="inputFilterAbility"
                        options={listability}
                        handleChange={(e) => setFilterAbility(e)}
                        value={filterAbility} />
                    <Button className="btnFilter" onClick={() => GetPokemonByAbility()} >🔎 Buscar</Button>
                </div>
            </div>
            <InfiniteScroll className="scrollDiv"
                dataLength={getList}
                next={fetchMoreData}
                hasMore={true}
                loader={listPokemonHtml ? <></> : <h4>Loading...</h4>}
            >
                {listPokemonHtml ? listPokemonHtml :
                    listPokemon.map((x) => {
                        let imgPokemon = x.url.split("/");
                        let numberPokemon = imgPokemon[imgPokemon.length - 2]
                        return <CardPokemon name={x.name} number={numberPokemon} />
                    })}
            </InfiniteScroll>
        </div>
    )
}