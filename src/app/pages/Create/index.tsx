import React, { Component, ReactNode } from "react";

import {
    withStyles,
    Grid,
    TextField,
    Button,
    Card as CardMaterialUi,
    CardContent,
    CardActions,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Snackbar
} from "@material-ui/core";
import { Card, Modal } from "react-bootstrap";
import { Alert, AlertTitle, Color } from '@material-ui/lab';

import TransporteUniversitarioService from "../../../services/TransporteUniversitarioService";

import NavBar from "../../components/NavBar";

type MyState = {
    object: any,
    valor: any,
    curso: any,
    campus: any,
    roteiro: any,
    onibus: any,
    empresa_onibus: any,
    selectedCurso: any,
    selectedRoteiro: any,
    selectedOnibus: any,
    cursosAvailable: Array<any>,
    roteirosAvailable: Array<any>,
    onibusAvailable: Array<any>,
    cursos: Array<any>,
    roteiros: Array<any>,
    arrayOnibus: Array<any>,
    showModalCurso: boolean,
    showModalRoteiro: boolean,
    showModalOnibus: boolean,
    showSnackBar: boolean,
    titleAlert: string,
    descriptionAlert: string,
    severity?: Color
}

class Create extends Component<any, MyState> {

    constructor(props: any) {
        super(props);

        this.state = {
            object: {},
            valor: {},
            curso: {},
            campus: {},
            roteiro: {},
            onibus: {},
            empresa_onibus: {},
            cursos: [],
            arrayOnibus: [],
            roteiros: [],
            selectedCurso: null,
            selectedRoteiro: null,
            selectedOnibus: null,
            cursosAvailable: [],
            roteirosAvailable: [],
            onibusAvailable: [],
            showModalCurso: false,
            showModalRoteiro: false,
            showModalOnibus: false,
            showSnackBar: false,
            titleAlert: '',
            descriptionAlert: '',
            severity: undefined,
        }
    }

    async componentDidMount() {
        const objects: any = await TransporteUniversitarioService.getAll();

        const arrayCursos: Array<any> = [];
        const arrayRoteiros: Array<any> = [];
        const arrayOnibus: Array<any> = [];

        objects.response.forEach((response: any) => {
            response.cursos.forEach((curso: any) => {
                if (curso._id) {
                    let hasCurso = arrayCursos.filter((c) => {
                        return c._id === curso._id;
                    });
                    if (hasCurso.length === 0) {
                        arrayCursos.push(curso);
                    }
                }
            });
            response.roteiros.forEach((roteiro: any) => {
                if (roteiro._id) {
                    var hasRoteiro = arrayRoteiros.filter((r) => {
                        return r._id === roteiro._id;
                    });
                    if (hasRoteiro.length === 0) {
                        arrayRoteiros.push(roteiro);
                    }
                }
                roteiro.onibus?.forEach((onibus: any) => {
                    if (onibus._id) {
                        var hasOnibus = arrayOnibus.filter((o) => {
                            return o._id === onibus._id;
                        });
                        if (hasOnibus.length === 0) {
                            arrayOnibus.push(onibus);
                        }
                    }
                });
            });
        })
        this.setState({ cursosAvailable: arrayCursos, roteirosAvailable: arrayRoteiros, onibusAvailable: arrayOnibus });
    }

    onClick(name: any, value: boolean, callback?: Function) {
        this.setState({ ...this.state, [name]: value }, () => { if (callback) { callback() } });
    }

    private onChange(name: string, value: any): void {
        this.setState({ object: { ...this.state.object, [name]: value } });
    }

    private onChangeValor(name: string, value: any): void {
        this.setState({ valor: { ...this.state.valor, [name]: value } });
    }

    private onChangeCurso(name: string, value: any): void {
        this.setState({ curso: { ...this.state.curso, [name]: value } });
    }

    private onChangeCampus(name: string, value: any): void {
        this.setState({ campus: { ...this.state.campus, [name]: value } });
    }

    private onChangeRoteiro(name: string, value: any): void {
        this.setState({ roteiro: { ...this.state.roteiro, [name]: value } });
    }

    private onChangeOnibus(name: string, value: any): void {
        this.setState({ onibus: { ...this.state.onibus, [name]: value } });
    }

    private onChangeEmpresaOnibus(name: string, value: any): void {
        this.setState({ empresa_onibus: { ...this.state.empresa_onibus, [name]: value } });
    }

    private onChangeSelectCurso(object: any): void {
        this.setState({ selectedCurso: object });
    }

    private onChangeSelectRoteiro(object: any): void {
        this.setState({ selectedRoteiro: object });
    }

    private onChangeSelectOnibus(object: any): void {
        this.setState({ selectedOnibus: object });
    }

    showAlert(titleAlert: string, descriptionAlert: string, severity: Color) {
        this.setState({ titleAlert, descriptionAlert, severity }, () => {
            this.setState({ showSnackBar: true });
        })
    }

    hideSnackBar() {
        this.setState({ showSnackBar: false });
    }

    renderAlert() {
        const { showSnackBar, titleAlert, descriptionAlert, severity } = this.state;
        return <Snackbar open={showSnackBar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={3000} onClose={() => this.hideSnackBar()}>
            <Alert severity={severity}>
                <AlertTitle>
                    {titleAlert}
                </AlertTitle>
                {descriptionAlert}
            </Alert>
        </Snackbar>
    }

    private async sendObject() {
        const { object, valor, cursos, roteiros } = this.state;

        if (object.nome) {
            const objectSend = {
                ...object,
                valor,
                cursos,
                roteiros
            }

            const res: any = await TransporteUniversitarioService.save(objectSend);
            const { response } = res;
            if (response._id) {
                this.showAlert('Sucesso', 'As informações foram enviadas com sucesso!', 'success');
                setTimeout(() => {
                    this.props.history.push("/");
                }, 3000);
            }
        } else {
            this.showAlert('Error', 'Preencha o campo do nome!', 'error');
        }
    }

    private addSelectedCurso() {
        const { selectedCurso, cursos } = this.state;

        var hasCurso = cursos.filter((c) => {
            return c._id === selectedCurso._id;
        });

        if (hasCurso.length === 0) {
            this.setState(prevState => ({
                cursos: [...prevState.cursos, selectedCurso]
            }), () => {
                this.showAlert('Sucesso', 'Curso adicionado a sua lista!', 'success');
                this.setState({ selectedCurso: null });
            });
        } else {
            this.showAlert('Error', 'Este curso já foi adicionado!', 'error');
        }
    }

    private addSelectedRoteiro() {
        const { selectedRoteiro, roteiros } = this.state;

        var hasRoteiro = roteiros.filter((r) => {
            return r._id === selectedRoteiro._id;
        });

        if (hasRoteiro.length === 0) {
            this.setState(prevState => ({
                roteiros: [...prevState.roteiros, selectedRoteiro]
            }), () => {
                this.showAlert('Sucesso', 'Roteiro adicionado a sua lista!', 'success');
                this.setState({ selectedRoteiro: null });
            });
        } else {
            this.showAlert('Error', 'Este roteiro já foi adicionado!', 'error');
        }
    }

    private addSelectedOnibus() {
        const { selectedOnibus, arrayOnibus } = this.state;

        var hasOnibus = arrayOnibus.filter((o) => {
            return o._id === selectedOnibus._id;
        });

        if (hasOnibus.length === 0) {
            this.setState(prevState => ({
                arrayOnibus: [...prevState.arrayOnibus, selectedOnibus]
            }), () => {
                this.showAlert('Sucesso', 'Ônibus adicionado a sua lista!', 'success');
                this.setState({ selectedOnibus: null });
            });
        } else {
            this.showAlert('Error', 'Este ônibus já foi adicionado!', 'error');
        }
    }

    private removeToArray(object: any, array: any, nameArray: any) {
        let newArray = [];
        if (object._id) {
            newArray = array.filter((ob: any) => {
                return ob._id !== object._id;
            });
            this.setState({ ...this.state, [nameArray]: newArray });
        } else {
            if (object.nome) {
                newArray = array.filter((ob: any) => {
                    return ob.nome !== object.nome;
                });
                this.setState({ ...this.state, [nameArray]: newArray });
            } else if (object.modelo) {
                newArray = array.filter((ob: any) => {
                    return ob.modelo !== object.modelo;
                });
                this.setState({ ...this.state, [nameArray]: newArray });
            }
        }
    }

    private addNewCurso() {
        const { curso, cursos, campus } = this.state;
        const objectCurso = {
            ...curso,
            campus
        }

        if (objectCurso.nome) {
            var hasCurso = cursos.filter((c) => {
                return c.nome === objectCurso.nome;
            });

            if (hasCurso.length === 0) {
                this.setState(prevState => ({
                    cursos: [...prevState.cursos, objectCurso]
                }), () => {
                    this.setState({ curso: {}, campus: {} }, () => {
                        this.onClick('showModalCurso', false);
                        this.showAlert('Sucesso', 'Curso adicionado a sua lista!', 'success');
                    })
                })
            } else {
                this.showAlert('Error', 'Este curso já foi adicionado!', 'error');
            }
        } else {
            this.showAlert('Error', 'Preencha o campo do nome do curso!', 'error');
        }
    }

    private addNewOnibus() {
        const { onibus, arrayOnibus, empresa_onibus } = this.state;

        if (onibus.modelo) {
            var hasOnibus = arrayOnibus.filter((o) => {
                return onibus.modelo === o.modelo;
            });

            const objectOnibus = {
                ...onibus,
                empresa_onibus
            }

            if (hasOnibus.length === 0) {
                this.setState(prevState => ({
                    arrayOnibus: [...prevState.arrayOnibus, objectOnibus]
                }), () => {
                    this.setState({ onibus: {}, empresa_onibus: {} }, () => {
                        this.onClick('showModalOnibus', false, () => {
                            this.onClick('showModalRoteiro', true);
                            this.showAlert('Sucesso', 'Ônibus adicionado a sua lista!', 'success');
                        });
                    })
                })
            } else {
                this.showAlert('Error', 'Este ônibus já foi adicionado!', 'error');
            }
        } else {
            this.showAlert('Error', 'Preencha o modelo do ônibus!', 'error');
        }
    }

    private addNewRoteiro() {
        const { arrayOnibus, roteiro, roteiros } = this.state;

        if (roteiro.nome) {
            const objectRoteiro = {
                ...roteiro,
                onibus: arrayOnibus
            }

            var hasRoteiro = roteiros.filter((r) => {
                return roteiro.nome === r.nome;
            });

            if (hasRoteiro.length === 0) {
                this.setState(prevState => ({
                    roteiros: [...prevState.roteiros, objectRoteiro]
                }), () => {
                    this.setState({ roteiro: {}, arrayOnibus: [] }, () => {
                        this.onClick('showModalRoteiro', false);
                        this.showAlert('Sucesso', 'Roteiro adicionado a sua lista!', 'success');
                    })
                })
            } else {
                this.showAlert('Error', 'Este roteiro já foi adicionado!', 'error');
            }
        } else {
            this.showAlert('Error', 'Preencha o nome do roteiro!', 'error');
        }
    }

    private renderCursos() {
        const { cursos } = this.state;
        const { classes } = this.props;

        return cursos.map((curso: any) => {
            return <Grid item xs={12} sm={3}>
                <CardMaterialUi className={classes.card}>
                    <CardContent>
                        <Typography color="primary">
                            {curso?.nome}
                        </Typography>
                        <Typography className={classes.grayDark}>
                            {curso?.nome_coordenador}
                        </Typography>
                        <Typography className={classes.grayDark}>
                            {curso?.tipo_curso?.nome}
                        </Typography>
                        <Typography className={classes.grayDark}>
                            {curso?.campus?.nome}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            size="small"
                            className={classes.buttonCard}
                            onClick={() => this.removeToArray(curso, cursos, 'cursos')}
                        >
                            REMOVER
                        </Button>
                    </CardActions>
                </CardMaterialUi>
            </Grid>
        });
    }

    private renderRoteiros() {
        const { roteiros } = this.state;
        const { classes } = this.props;

        return roteiros.map((roteiro: any) => {
            return <Grid item xs={12} sm={3}>
                <CardMaterialUi className={classes.card}>
                    <CardContent>
                        <Typography color="primary">
                            {roteiro?.nome}
                        </Typography>
                        <Typography className={classes.grayDark}>
                            {roteiro?.horario_saida}
                        </Typography>
                        <Typography className={classes.grayDark}>
                            {roteiro?.horario_chegada}
                        </Typography>
                        <Typography className={classes.grayDark}>
                            {roteiro?.tipo_roteiro?.nome}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            size="small"
                            className={classes.buttonCard}
                            onClick={() => this.removeToArray(roteiro, roteiros, 'roteiros')}
                        >
                            REMOVER
                        </Button>
                    </CardActions>
                </CardMaterialUi>
            </Grid>
        });
    }

    private renderArrayOnibus() {
        const { arrayOnibus } = this.state;
        const { classes } = this.props;

        return arrayOnibus.map((onibus: any) => {
            return <Grid item xs={12} sm={3}>
                <CardMaterialUi className={classes.card}>
                    <CardContent>
                        <Typography color="primary">
                            {onibus.modelo}
                        </Typography>
                        <Typography className={classes.grayDark}>
                            {onibus?.quantidade_assentos}
                        </Typography>
                        <Typography className={classes.grayDark}>
                            {onibus?.ano_fabricacao}
                        </Typography>
                        <Typography className={classes.grayDark}>
                            {onibus?.empresa_onibus?.nome}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            size="small"
                            className={classes.buttonCard}
                            onClick={() => this.removeToArray(onibus, arrayOnibus, 'arrayOnibus')}
                        >
                            REMOVER
                        </Button>
                    </CardActions>
                </CardMaterialUi>
            </Grid>
        });
    }

    private renderModalAddOnibus() {
        const { showModalOnibus, showModalRoteiro, onibus, empresa_onibus } = this.state;
        return <div>
            <Modal size="xl" centered show={showModalOnibus} onHide={() => {
                this.onClick('showModalOnibus', !showModalOnibus, () => {
                    this.onClick('showModalRoteiro', !showModalRoteiro);
                });
            }}>
                <Modal.Header>
                    <Modal.Title>Novo Ônibus</Modal.Title>
                </Modal.Header>
                <Card.Body>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth={true}
                                id="modelo"
                                label="Modelo"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeOnibus('modelo', e.target.value)}
                                value={onibus.modelo}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="quantidade_assentos"
                                label="Quantidade de assentos"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeOnibus('quantidade_assentos', e.target.value)}
                                value={onibus.quantidade_assentos}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="ano_fabricacao"
                                label="Ano de fabricação"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeOnibus('ano_fabricacao', e.target.value)}
                                value={onibus.ano_fabricacao}
                            />
                        </Grid>
                    </Grid>
                </Card.Body>
                <Card.Header>Empresa de ônibus</Card.Header>
                <Card.Body>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="nome"
                                label="Nome"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeEmpresaOnibus('nome', e.target.value)}
                                value={empresa_onibus.nome}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="cnpj"
                                label="CNPJ"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeEmpresaOnibus('cnpj', e.target.value)}
                                value={empresa_onibus.cnpj}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="endereco"
                                label="Endereço"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeEmpresaOnibus('endereco', e.target.value)}
                                value={empresa_onibus.endereco}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="telefone"
                                label="Telefone"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeEmpresaOnibus('telefone', e.target.value)}
                                value={empresa_onibus.telefone}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="cidade"
                                label="Cidade"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeEmpresaOnibus('cidade', { nome: e.target.value })}
                                value={empresa_onibus.cidade?.nome}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="estado"
                                label="Estado"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeEmpresaOnibus('estado', { nome: e.target.value })}
                                value={empresa_onibus.estado?.nome}
                            />
                        </Grid>
                    </Grid>
                </Card.Body>
                <Modal.Footer>
                    <Button variant="outlined" onClick={() => {
                        this.onClick('showModalOnibus', !showModalOnibus, () => {
                            this.onClick('showModalRoteiro', !showModalRoteiro);
                        });
                    }}>
                        Fechar
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => this.addNewOnibus()}>
                        Adicionar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    }

    private renderModalAddRoteiro() {
        const { showModalRoteiro, showModalOnibus, selectedOnibus, onibusAvailable, roteiro } = this.state;

        return <div>
            <Modal size="xl" centered show={showModalRoteiro} onHide={() => this.onClick('showModalRoteiro', !showModalRoteiro)}>
                <Modal.Header>
                    <Modal.Title>Novo Roteiro</Modal.Title>
                </Modal.Header>
                <Card.Body>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth={true}
                                id="nome"
                                label="Nome"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeRoteiro('nome', e.target.value)}
                                value={roteiro.nome}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="horario_saida"
                                label="Horário de saída"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeRoteiro('horario_saida', e.target.value)}
                                value={roteiro.horario_saida}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="horario_chegada"
                                label="Horário de chegada"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeRoteiro('horario_chegada', e.target.value)}
                                value={roteiro.horario_chegada}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth={true}
                                id="tipo_roteiro"
                                label="Tipo de roteiro"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeRoteiro('tipo_roteiro', { nome: e.target.value })}
                                value={roteiro.tipo_roteiro?.nome}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="cidadeOrigem"
                                label="Cidade de origem"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeRoteiro('cidadeOrigem', { nome: e.target.value })}
                                value={roteiro.cidadeOrigem?.nome}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="estadoOrigem"
                                label="Estado de origem"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeRoteiro('estadoOrigem', { nome: e.target.value })}
                                value={roteiro.estadoOrigem?.nome}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="cidadeDestino"
                                label="Cidade de destino"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeRoteiro('cidadeDestino', { nome: e.target.value })}
                                value={roteiro.cidadeDestino?.nome}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="estadoDestino"
                                label="Estado de destino"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeRoteiro('estadoDestino', { nome: e.target.value })}
                                value={roteiro.estadoDestino?.nome}
                            />
                        </Grid>
                    </Grid>
                </Card.Body>
                <Card.Header>Ônibus</Card.Header>
                <Card.Body>
                    <FormControl fullWidth={true} variant="outlined">
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={selectedOnibus}
                            onChange={(e: any) => this.onChangeSelectOnibus(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Nenhum</em>
                            </MenuItem>
                            {onibusAvailable.map((onibus: any) =>
                                <MenuItem value={onibus}>
                                    {onibus.modelo}
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    {selectedOnibus ? <Button style={{ marginTop: '10px', marginBottom: '15px' }} variant="contained" fullWidth={true} color="primary" onClick={() => this.addSelectedOnibus()}>
                        Adicionar
                    </Button> : null}
                    <Button fullWidth={true} style={{ marginTop: '10px' }} color="default" variant="contained" onClick={() => {
                        this.onClick('showModalRoteiro', !showModalRoteiro, () => {
                            this.onClick('showModalOnibus', !showModalOnibus);
                        });
                    }}>
                        NOVO ÔNIBUS
                    </Button>
                </Card.Body>
                <Card.Body>
                    <Grid container spacing={2}>
                        {this.renderArrayOnibus()}
                    </Grid>
                </Card.Body>
                <Modal.Footer>
                    <Button variant="outlined" onClick={() => this.onClick('showModalRoteiro', !showModalRoteiro)}>
                        Fechar
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => this.addNewRoteiro()}>
                        Adicionar
                 </Button>
                </Modal.Footer>
            </Modal>
        </div >
    }

    private renderModalAddCurso() {
        const { showModalCurso, curso, campus } = this.state;
        return <div>
            <Modal size="xl" centered show={showModalCurso} onHide={() => this.onClick('showModalCurso', !showModalCurso)}>
                <Modal.Header>
                    <Modal.Title>Novo Curso</Modal.Title>
                </Modal.Header>
                <Card.Body>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth={true}
                                id="nome"
                                label="Nome"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeCurso('nome', e.target.value)}
                                value={curso.nome}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth={true}
                                id="nome_coordenador"
                                label="Nome do coordenador"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeCurso('nome_coordenador', e.target.value)}
                                value={curso.nome_coordenador}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth={true}
                                id="tipo_curso"
                                label="Tipo do curso"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeCurso('tipo_curso', { nome: e.target.value })}
                                value={curso.tipo_curso?.nome}
                            />
                        </Grid>
                    </Grid>
                </Card.Body>
                <Card.Header>Campus</Card.Header>
                <Card.Body>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth={true}
                                id="nome"
                                label="Nome"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeCampus('nome', e.target.value)}
                                value={campus.nome}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth={true}
                                id="endereco"
                                label="Endereço"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeCampus('endereco', e.target.value)}
                                value={campus.endereco}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth={true}
                                id="telefone"
                                label="Telefone"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeCampus('telefone', e.target.value)}
                                value={campus.telefone}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="cidade"
                                label="Cidade"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeCampus('cidade', { nome: e.target.value })}
                                value={campus.cidade?.nome}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth={true}
                                id="estado"
                                label="Estado"
                                variant="outlined"
                                onChange={(e: any) => this.onChangeCampus('estado', { nome: e.target.value })}
                                value={campus.estado?.nome}
                            />
                        </Grid>
                    </Grid>
                </Card.Body>
                <Modal.Footer>
                    <Button variant="outlined" onClick={() => this.onClick('showModalCurso', !showModalCurso)}>
                        Fechar
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => this.addNewCurso()}>
                        Adicionar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    }


    render(): ReactNode {
        const { classes } = this.props;
        const { showModalCurso,
            showModalRoteiro,
            object,
            valor,
            selectedCurso,
            selectedRoteiro,
            cursosAvailable,
            roteirosAvailable,
        } = this.state;

        return (
            <div style={{ paddingTop: '40px' }}>
                <NavBar pathName={this.props.location.pathname} />
                {this.renderAlert()}
                <div className={classes.container}>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                        className={classes.grid}
                    >
                        <Card className={classes.cardInput}>
                            <Card.Header>Aluno</Card.Header>
                            <Card.Body>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth={true}
                                            id="nome"
                                            label="Nome" variant="outlined"
                                            onChange={(e: any) => this.onChange('nome', e.target.value)}
                                            value={object.nome}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth={true}
                                            id="endereço"
                                            label="Endereço"
                                            variant="outlined"
                                            onChange={(e: any) => this.onChange('endereco', e.target.value)}
                                            value={object.endereco}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth={true}
                                            id="telefone"
                                            label="Telefone"
                                            variant="outlined"
                                            onChange={(e: any) => this.onChange('telefone', e.target.value)}
                                            value={object.telefone}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth={true}
                                            id="cpf"
                                            label="CPF"
                                            variant="outlined"
                                            onChange={(e: any) => this.onChange('cpf', e.target.value)}
                                            value={object.cpf}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth={true}
                                            id="email"
                                            label="Email"
                                            variant="outlined"
                                            onChange={(e: any) => this.onChange('email', e.target.value)}
                                            value={object.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth={true}
                                            id="ano_semestre"
                                            label="Ano semestre"
                                            variant="outlined"
                                            onChange={(e: any) => this.onChange('ano_semestre', e.target.value)}
                                            value={object.ano_semestre}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth={true}
                                            id="turno"
                                            label="Turno"
                                            variant="outlined"
                                            onChange={(e: any) => this.onChange('turno', { nome: e.target.value })}
                                            value={object.turno?.nome}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth={true}
                                            id="cidade"
                                            label="Cidade"
                                            variant="outlined"
                                            onChange={(e: any) => this.onChange('cidade', { nome: e.target.value })}
                                            value={object.cidade?.nome}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth={true}
                                            id="estado"
                                            label="Estado"
                                            variant="outlined"
                                            onChange={(e: any) => this.onChange('estado', { nome: e.target.value })}
                                            value={object.estado?.nome}
                                        />
                                    </Grid>
                                </Grid>
                            </Card.Body>
                            <Card.Header>Valor</Card.Header>
                            <Card.Body>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth={true}
                                            id="valor"
                                            label="Valor"
                                            variant="outlined"
                                            onChange={(e: any) => this.onChangeValor('valor', e.target.value)}
                                            value={valor.valor}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth={true}
                                            id="porcentagemDesconto"
                                            label="Porcentagem desconto"
                                            variant="outlined"
                                            onChange={(e: any) => this.onChangeValor('porcentagemDesconto', e.target.value)}
                                            value={valor.porcentagemDesconto}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth={true}
                                            id="dataVencimento"
                                            label="Data de vencimento"
                                            variant="outlined"
                                            onChange={(e: any) => this.onChangeValor('dataVencimento', e.target.value)}
                                            value={valor.dataVencimento}
                                        />
                                    </Grid>
                                </Grid>
                            </Card.Body>
                            <Card.Header>Cursos</Card.Header>
                            <Card.Body>
                                <FormControl fullWidth={true} variant="outlined">
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={selectedCurso}
                                        onChange={(e: any) => this.onChangeSelectCurso(e.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>Nenhum</em>
                                        </MenuItem>
                                        {cursosAvailable.map((curso: any) =>
                                            <MenuItem value={curso}>
                                                {curso.nome}
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                {selectedCurso ? <Button style={{ marginTop: '10px' }} variant="contained" fullWidth={true} color="primary" onClick={() => this.addSelectedCurso()}>
                                    Adicionar
                                </Button> : null}
                            </Card.Body>
                            <Button className={classes.buttonAdd} color="default" variant="contained" onClick={() => this.onClick('showModalCurso', !showModalCurso)}>
                                NOVO CURSO
                            </Button>
                            <Card.Body>
                                {this.renderModalAddCurso()}
                                <Grid container spacing={2}>
                                    {this.renderCursos()}
                                </Grid>
                            </Card.Body>
                            <Card.Header>Roteiros</Card.Header>
                            <Card.Body>
                                <FormControl fullWidth={true} variant="outlined">
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={selectedRoteiro}
                                        onChange={(e: any) => this.onChangeSelectRoteiro(e.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>Nenhum</em>
                                        </MenuItem>
                                        {roteirosAvailable.map((roteiro: any) =>
                                            <MenuItem value={roteiro}>
                                                {`${roteiro.nome} | ${roteiro?.horario_saida} ${roteiro?.horario_chegada}`}
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                {selectedRoteiro ? <Button style={{ marginTop: '10px' }} variant="contained" fullWidth={true} color="primary" onClick={() => this.addSelectedRoteiro()}>
                                    Adicionar
                                </Button> : null}
                            </Card.Body>
                            <Button className={classes.buttonAdd} style={{ marginTop: '10px' }} color="default" variant="contained" onClick={() => this.onClick('showModalRoteiro', !showModalRoteiro)}>
                                NOVO ROTEIRO
                            </Button>
                            <Card.Body>
                                {this.renderModalAddOnibus()}
                                {this.renderModalAddRoteiro()}
                                <Grid container spacing={2}>
                                    {this.renderRoteiros()}
                                </Grid>
                            </Card.Body>
                            <Button className={`${classes.buttonAdd} ${classes.buttonSend}`} size="large" variant="contained" onClick={() => this.sendObject()}>ENVIAR</Button>
                        </ Card>
                    </Grid>
                </div>
            </div >
        );
    }
}

const styles: any = {
    container: {
        padding: '10px'
    },
    grid: {
        margin: '10px',
        width: '100%'
    },
    cardInput: {
        marginTop: '20px',
        maxWidth: '100%',
        width: '90%'
    },
    buttonAdd: {
        marginLeft: '20px',
        marginRight: '20px'
    },
    buttonSend: {
        marginBottom: '20px',
        backgroundColor: '#343A40',
        color: 'white'
    },
    card: {
        backgroundColor: '#E0E0E0'
    },
    grayDark: {
        color: '#343A40'
    },
    buttonCard: {
        color: '#FE0000',
        marginLeft: '5px'
    }
}

export default withStyles(styles)(Create);
