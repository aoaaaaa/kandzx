$(function(){
	//重置表单

	//点击新增按钮出现新增的form表单
	$('.bottom-content>button:first-child').click(function(){
		$('.right-add').css('display','block');
	});
	$('button[type=reset]').trigger('click');
	$('messageSpan').empty();
	//点击返回form表单消失
	$('.right-tianjia>div>span:first-child').click(function(){
		$('.right-add').css('display','none');
	});

	//点击空白处form表单消失
	$('.left-zhegai').click(function(){
		$('.right-add').css('display','none');
	});


	//监听开关按钮更改的事件
	$('.neirong').on({
		'switchChange.bootstrapSwitch':function(event,state){
			var id=$(this).closest('.switch').prev('input').val();
			//封装成对象给后台，属性名是由和后台接口决定，属性值是前端采集的数据
			var obj={
				id:id,
				status:state
			};
			$.post({
				url:baseURL+'/manager/user/changeStatus',
				data:obj,
				success:function(res){
					// console.log(res);
				}
			});
		}
	},'[type=checkbox]');

	//获取数据
	loadData();
	function loadData(){
		//清空数据
		$('.neirong').empty();
		$.get({
			url:baseURL+'/manager/user/findAllUser',
			success:function(res){
				res.data.forEach(function(item,index){
					//生成缩略图节点，追加
					var $thm=$(`
						<div class="col-sm-4" id="my">
						    <div class="thumbnail">
						      	<img src="`+(item.userface?item.userface:'img/u474.png')+`" alt="...">
						      	<div class="caption">
							      	<div class="row">
							      		<div class="col-sm-5">用户名</div>
							      		<div class="col-sm-7">`+(item.username?item.username:'--')+`</div>
							      	</div>
							      	<div class="row">
							      		<div class="col-sm-5">真实姓名</div>
							      		<div class="col-sm-7">`+(item.nickname?item.nickname:'--')+`</div>
							      	</div>
							      	<div class="row">
							      		<div class="col-sm-5">注册时间</div>
							      		<div class="col-sm-7">`+(item.regTime?item.regTime:'--')+`</div>
							      	</div>
							      	<div class="row">
							      		<div class="col-sm-5">email</div>
							      		<div class="col-sm-7">`+(item.email?item.email:'--')+`</div>
							      	</div>
							      	<div class="row">
							      		<div class="col-sm-5">状态</div>
							      		<div class="col-sm-7">
							      			<!-- 用户id -->
							      			<input type="hidden" value="`+(item.id?item.id:'--')+`">
							      			<!-- 开关按钮 -->
							      			<div class="switch">
							      				<input type="checkbox">
							      			</div>
							      		</div>
							      	</div>
						      	</div>
						    </div>
				  		</div>
					`);
					$thm.appendTo('.neirong');
					//初始化复选按钮，开关按钮
					$('.neirong input[type=checkbox').bootstrapSwitch('state',item.enabled);
				})
			}
		});
	}

	// $('.saveBtn').preventDefault();

	//给确认按钮绑定事件
	$('.saveBtn').click(function(){
		var username=$('input[name=username]').val();
		var password=$('input[name=password]').val();
		var password1=$('input[name=password1]').val();
		var nickname=$('input[name=nickname]').val();
		var email=$('input[name=email]').val();
		var photo=$('input[name=photo]').val();
		var photo1=$('input[name=photo1]').val();
		var message='';
		if(username&&password&&password1&&nickname&&email){
			if(password==password1){
				var obj={
					username:username,
					password:password,
					nickname:nickname,
					email:email,
					userface:photo
				};
				$.post({
					url:baseURL+'/manager/user/saveOrUpdateUser',
					data:obj,
					success:function(res){
						alert('保存成功');
						//刷新页面，提示用户执行成功
						loadData();
						$('.alertDiv').css('display','block');
						setTimeout(function(){
							$('.alertDiv').fadeOut();
						},2000);
					}
				});
			}
			else{
				message='密码输入不一致,请重新输入';
				alert('密码输入不一致，请重新输入')
			}
		}
		else{
			message='请输入完整的信息';
			alert('请输入完整的信息');
		}
		$('.messageSpan').html(message);
	});

});