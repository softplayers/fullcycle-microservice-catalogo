// @flow 
import MUIDataTable, {MUIDataTableColumn} from 'mui-datatables';
import * as React from 'react';

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: "name",
        label: "Nome",
    },
    {
        name: "is_active",
        label: "Ativo?",
    },
    {
        name: "created_at",
        label: "Criado em",
    },
]

const data = [
    {name: 'teste1', is_active: true, created_at: "2021-02-17"},
    {name: 'teste2', is_active: true, created_at: "2021-02-18"},
    {name: 'teste3', is_active: true, created_at: "2021-02-19"},
    {name: 'teste4', is_active: true, created_at: "2021-02-20"},
    {name: 'teste5', is_active: true, created_at: "2021-02-21"},
    {name: 'teste6', is_active: true, created_at: "2021-02-22"},
]

type Props = {};

const Table = (props: Props) => {

    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        console.log('[useEffect] empty (mounted)');
        return () => console.log('[useEffect] return (unmounted)');
    }, []);


    React.useEffect(() => {
        console.log('[useEffect] count:', count);
        return () => console.log('[useEffect] return (count)');
    }, [count]);

    return (
        <button onClick={() => setCount(count+1)}>{count}</button>
    );

    return (
        <MUIDataTable 
            title="Listagem de categorias"
            columns={columnsDefinition}
            data={data}>
        </MUIDataTable>
    );
};

export default Table;
