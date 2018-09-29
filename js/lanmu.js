$(function(){
	//所有的栏目
	var categories=[];

	/*
		后台中关于新增和修改的区别在于有没有传id，传id为修改，不传id为新增
		所以要先判断有没有传id
		点击新增的提交的时候，不传id
		点击修改的提交的时候，传id
		在点击提交按钮的时候判断是新增还是修改，从而决定是否携带id给后台
	*/
	var option='新增';

	//当前正在修改的对象的id
	var currentId='';

	//点击新增按钮出现新增的form表单
	$('.addBtn').click(function(){
		option='新增';
		//清空表单，清空提示信息
		$('button[type=reset]').trigger('click');
		$('.messageSpan').html('');
		addOption();
		$('.right-add').css('display','block');
	});

	//点击返回form表单消失
	$('.right-tianjia>div>span:first-child').click(function(){
		$('.right-add').css('display','none');
	});

	//点击空白处form表单消失
	$('.left-zhegai').click(function(){
		$('.right-add').css('display','none');
	});

	//追加option,清空select父栏目中的所有内容，除了第一行，从后台获取所有栏目追加到option中
	function addOption(handle){
		$('select[name=parent] option:not(:first)').remove();
		$.get({
			url:baseURL+'/manager/category/findAllCategory',
			success:function(res){
				res.data.forEach(function(item,index){
					$('<option value="'+item.id+'">'+item.name+'</option>').appendTo($('select[name=parent]'))
				});
				if(handle){
					handle();
				}
			}
		});
	}

	//获取数据
	loadData();
	function loadData(){
		$('.addcontent').remove();
		$.get({
			url:baseURL+'/manager/category/findAllCategory',
			success:function(res){
				categories=res.data;
				for(var i=0;i<res.data.length;i++){
					$(`
						<tr class="addcontent">
							<td>
								<input type="checkbox" value="`+res.data[i].id+`">
							</td>
							<td>`+res.data[i].name+`</td>
							<td>`+(res.data[i].parent?res.data[i].parent.name:"--")+`</td>
							<td>`+res.data[i].comment+`</td>
							<td>
								<i class="iconfont icon-edit-1-copy" title="修改"></i>
								<i class="iconfont icon-shanchu" title="删除"></i>
							</td>
						</tr>
					`).appendTo($('.lanmutable'));
				}
			},
			error:function(error){
				alert(error);
			}
		});
	}
		

	//单行删除
	$('.lanmutable').on({
		click:function(){
			currentId=$(this).closest('tr').find('input').val();
			$.get({
				url:baseURL+'/manager/category/deleteCategoryById',
				data:{
					id:currentId
				},
				success:function(res){
					if(res.status==200){
						alert('删除成功');
						loadData();
					}
					else{
						alert('删除失败');
						console.log(res.message);
					}
				},
				error:function(error){
					alert(error);
				}
			});
		}
	},'i[title=删除]')


	//批量删除
	$('button:contains(批量删除)').click(function(){
		//获取用户选择的checkbox，获取对应的id数组，转换成字符串传递给后台
		var ids=$('.lanmutable input[type=checkbox]:checked').map(function(index,item){
			return $(item).val();
		}).get();
		var obj={
			ids:ids.toString()
		}
		$.post({
			url:baseURL+'/manager/category/batchDeleteCategory',
			data:obj,
			success:function(res){
				if(res.status==200){
					alert('删除成功');
					loadData();
				}
				else{
					alert('删除失败');
					console.log(res.message);
				}	
			}
		});
	});

	//修改
	$('.lanmutable').on({
		click:function(){
			option='修改';
			//清空提示信息
			$('.messageSpan').html('');
			//获取当前要修改的id
			currentId=$(this).closest('tr').find('input[type=checkbox]').val();
			//获取对应对象
			var cat=categories.filter(function(item){
				return item.id==currentId;
			})[0];
			//设置值（select比较麻烦，获取所有栏目追加option，设置值）
			$('input[name=Categorname]').val(cat.name);
			$('textarea[name=comment]').val(cat.comment);
			addOption(function(){
				$('select[name=parent]').val(cat.parent?cat.parent.id:'----');
			});
			$('.right-add').css('display','block');
		}
	},'i[title=修改]');
	


	//保存
	$('.saveBtn').click(function(){
		var Categorname=$('input[name=Categorname]').val();
		var parent=$('select[name=parent]').val();
		var Categorcomment=$('textarea[name=comment]').val();
		var message='';
		console.log(Categorname);
		console.log($('textarea[name=comment]'));

		if(Categorname&&Categorcomment){
			var obj={
				name:Categorname,
				comment:Categorcomment,
				no:'',
				parentId:parent
			};	
			if(option=='修改'){
				obj.id=currentId;
			}
			$.post({
				url:baseURL+'/manager/category/saveOrUpdateCategory',
				data:obj,
				success:function(res){
					alert('保存成功');
					//刷新页面，提示用户执行成功

					loadData();
					$('.alertDiv').show();
					setTimeout(function(){
						$('.alertDiv').fadeOut()
					},2000);
				}
			});
		}
		else{
			message='请输入完整的信息';
			$('.messageSpan').html(message);
			alert('请输入完整的信息');
		}
	});


});
