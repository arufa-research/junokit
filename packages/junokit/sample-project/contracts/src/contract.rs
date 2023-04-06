use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response,
    StdResult, StdError,
};

use crate::error::ContractError;
use crate::msg::{ ExecuteMsg, InstantiateMsg, QueryMsg, CountResponse};
use crate::state::{Constants, CONSTANTS};

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = Constants {
        count: msg.count,
        owner: _info.sender.to_string()
    };
    CONSTANTS.save(deps.storage,&state)?;
    Ok(Response::new()
        .add_attribute("action", "initialisation")
        .add_attribute("sender", _info.sender.clone()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Increment {} => try_increment(deps, env, info),
        ExecuteMsg::Reset { count } => try_reset(deps, env, info, count),
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
           QueryMsg::GetCount {} => query_count(deps),
    }
}

fn try_increment(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
) -> Result<Response, ContractError> {
    let mut constant = CONSTANTS.load(deps.storage)?;
    constant.count += 1;
    CONSTANTS.save(deps.storage,&constant)?;
    Ok(Response::new()
        .add_attribute("action", "increament"))
}

fn try_reset(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    count: i32
) -> Result<Response, ContractError> {
    let mut constant = CONSTANTS.load(deps.storage)?;
    if constant.owner != info.sender {
        return Err(ContractError::Std(StdError::generic_err(
            "Unauthorized",
        )));
    }
    constant.count = count;
    CONSTANTS.save(deps.storage, & constant)?;
    Ok(Response::new()
        .add_attribute("action", "COUNT reset successfully"))
}

pub fn query_count(_deps: Deps) -> StdResult<Binary> {
    let constant = CONSTANTS.load(_deps.storage)?;
    to_binary(&(CountResponse {count : constant.count}))
}
