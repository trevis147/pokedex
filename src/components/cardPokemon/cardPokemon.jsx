import { useEffect, useState } from "react";
import { Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import api from "../../services/api";

export default function CardPokemon(props) {
    const { number, name } = props;

    useEffect(() => {
        getType(number);
    }, [number]);

    const [modal, setModal] = useState(false);
    const [types, setTypes] = useState(<></>);
    const [abilitys, setAbilitys] = useState(<></>);
    const [statusPokemon, setStatusPokemon] = useState(<></>);
    const toggle = () => setModal(!modal);

    async function getType(num) {
        let ret = await api.get('pokemon/' + num);
        setDataPokemon(ret);
        let html = (<div className="cardTypes">
            {ret.data.types.map((x) => {
                return <Label className={"type " + x.type.name}>{x.type.name}</Label>
            })}
        </div>);

        setTypes(html);
        let htmlAbility = <div className="DivAbility">
            <h5>Habilidades</h5>
            {ret.data.abilities.map((x) => {
                return <Label className="ability">{x.ability.name}</Label>
            })
            }</div>
        setAbilitys(htmlAbility);
    }
    function setDataPokemon(ret) {
        let status = (
            <div className="dataStatus">
                <h5>Status</h5>
                {ret.data.stats.map((x) => {
                    return (
                        <>
                            <Label>{x.stat.name}: {x.base_stat}</Label>
                            <br />
                        </>
                    )
                })}
            </div>);
        setStatusPokemon(status);
    }


    return (<>
        <div className="cardPokemon" onClick={toggle}>
            <img className="imgPokemon" src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + number + ".png"} alt={"pokemon" + number} width={247} />
            <Label className="numberPokemon">N°{number}</Label>
            <Label className="namePokemon">{name}</Label>
            {types}
        </div>

        <Modal isOpen={modal} toggle={toggle} className="">
            <ModalHeader className="titleModal" toggle={toggle}>{name}</ModalHeader>
            <ModalBody className="modalPokemon">
                <div className="body">
                    <div>
                        {types}
                    </div>
                    <div className="status">
                        <img className="modalImgPokemon" src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + number + ".png"} alt={"pokemon" + number} width={247} />
                        {statusPokemon}
                    </div>
                    {abilitys}
                </div>
            </ModalBody>
        </Modal>
    </>
    )
}